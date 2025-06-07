// Variables globales
let ophirofoxSettings;
let ophirofoxReadRequest = null;
let ophirofoxRequestType = null;
let isMenuCreated = false;

// Configuration des scripts de contenu
const europresse_content_script = {
  css: ["/content_scripts/europresse_article.css"],
  js: ["/content_scripts/europresse_article.js", "/content_scripts/europresse_search.js"]
};

// ======== FONCTIONS DE GESTION DES PARAMÈTRES ========

/**
 * Charge les paramètres depuis le stockage local
 */
function loadSettings() {
  chrome.storage.local.get(["ophirofox_settings"], function (data) {
    if (data.ophirofox_settings) {
      try {
        ophirofoxSettings = typeof data.ophirofox_settings === "string"
          ? JSON.parse(data.ophirofox_settings)
          : data.ophirofox_settings;
        if (ophirofoxSettings.add_search_menu && !isMenuCreated) {
          console.log(`createEuropresseSearchMenu`);
          createEuropresseSearchMenu();
        }
        console.log("Settings chargés :", ophirofoxSettings);
      } catch (err) {
        console.error("Erreur lors du chargement des settings :", err);
      }
    }
  });
}

// ======== FONCTIONS D'INJECTION DE SCRIPTS ========

/**
 * Fonction exécutée lors de la navigation
 * @param {Object} param0 - Objet contenant l'ID de l'onglet
 */
function webNavigationListener({ tabId }) {
  europresse_content_script.js.forEach(file => chrome.tabs.executeScript(tabId, { file }));
  europresse_content_script.css.forEach(file => chrome.tabs.insertCSS(tabId, { file }));
}

/**
 * Injecte les scripts Europresse en utilisant l'API webNavigation
 * @param {string[]} europresse_origins - Origines Europresse
 */
async function injectEuropressUsingWebNavigation(europresse_origins) {
  const url = europresse_origins.map(origin => ({ hostEquals: new URL(origin).hostname }));
  if (url.length === 0) return;
  console.log("Adding webNavigation listener", url);
  chrome.webNavigation.onDOMContentLoaded.addListener(webNavigationListener, { url });
}

/**
 * Désenregistre les scripts de contenu existants
 */
async function unregisterContentScripts() {
  try {
    await new Promise(acc => chrome.scripting.unregisterContentScripts({ ids: ["europresse"] }, acc));
    console.log("Unregistered old content script");
  } catch (err) {
    console.log("No old content script unregistered", err);
  }
}

/**
 * Enregistre les nouveaux scripts de contenu
 * @param {Object} content_script - Configuration du script de contenu
 */
async function registerContentScripts(content_script) {
  try {
    await new Promise(acc => chrome.scripting.registerContentScripts([content_script], acc));
    console.log("Registered new content script");
  } catch (err) {
    // Old versions of firefox do not suppport persistent content scripts
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/RegisteredContentScript
    content_script.persistAcrossSessions = false;
    await new Promise(acc => chrome.scripting.registerContentScripts([content_script], acc));
  }
}

/**
 * Injecte les scripts Europresse en utilisant l'API scripting
 * @param {string[]} matches - Patterns URL correspondants
 */
async function injectEuropressUsingScripting(matches) {
  const content_script = { ...europresse_content_script, matches, id: "europresse" };
  await unregisterContentScripts();
  await registerContentScripts(content_script);
  console.log("Injected Europress using scripting", matches);
}

/**
 * Fonction principale pour injecter les scripts Europresse
 */
async function injectEuropress() {
  chrome.permissions.getAll(({ origins, permissions }) => {
    const europresse_origins = origins.filter(origin => /europresse|eureka/.test(origin));
    if (permissions.includes("scripting") && europresse_origins.length > 0) {
      injectEuropressUsingScripting(europresse_origins);
    } else if (permissions.includes("webNavigation") && europresse_origins.length > 0) {
      injectEuropressUsingWebNavigation(europresse_origins);
    } else {
      console.log("No permission to inject Europress at the moment, opening options page");
      chrome.runtime.openOptionsPage();
    }
  });
}

// ======== ÉCOUTEURS D'ÉVÉNEMENTS ========

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    chrome.runtime.openOptionsPage();
  }
  loadSettings();
});

chrome.runtime.onStartup.addListener(loadSettings);
chrome.permissions.onAdded.addListener(injectEuropress);
chrome.permissions.onRemoved.addListener(injectEuropress);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.ophirofox_settings) {
    loadSettings();
  }
  injectEuropress();
});


chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") {
    if (changes.ophirofox_request_type) {
      ophirofoxRequestType = changes.ophirofox_request_type.newValue || null;
      // console.log("Ophirofox RequestType mis à jour :", ophirofoxRequestType);
    }
    if (changes.ophirofox_read_request) {
      ophirofoxReadRequest = changes.ophirofox_read_request.newValue || null;
      // console.log("Ophirofox ReadRequest mis à jour :", ophirofoxReadRequest);
    }
  }
});

function loadRequestData() {
  chrome.storage.local.get(["ophirofox_request_type", "ophirofox_read_request"], function(data) {
    ophirofoxRequestType = data.ophirofox_request_type || null;
    ophirofoxReadRequest = data.ophirofox_read_request || null;
    console.log("Valeurs initiales chargées:", { ophirofoxRequestType, ophirofoxReadRequest });
  });
}
loadRequestData();

// Interception des requêtes HTTP
const listener = function (details) {
  const url = new URL(details.url);
  const isTargetHost = url.hostname.includes("europresse.com") || url.hostname.includes("eureka.cc");
  const isTargetPath = url.pathname.startsWith("/access/httpref/default.aspx");
  
  if ((!ophirofoxRequestType && !ophirofoxReadRequest) || !ophirofoxSettings) {
    return { requestHeaders: details.requestHeaders };
  }
  
  if (isTargetHost && isTargetPath) {
    try {
      const manifest = chrome.runtime.getManifest();
      const partners = manifest.browser_specific_settings.ophirofox_metadata.partners;
      const partner = partners.find(p => p.name === ophirofoxSettings.partner_name);
      
      if (partner) {
        let referer;
        
        // Utiliser HTTP_REFERER s'il existe
        if (partner.HTTP_REFERER) {
          referer = partner.HTTP_REFERER;
        } 
        // Sinon utiliser AUTH_URL
        else if (partner.AUTH_URL) {
          const authUrl = new URL(partner.AUTH_URL);
          referer = `${authUrl.protocol}//${authUrl.hostname}`;
        }
        
        if (referer) {
          // Supprime l'en-tête Referer existant
          details.requestHeaders = details.requestHeaders.filter(h => h.name.toLowerCase() !== "referer");
          // Ajoute un nouvel en-tête Referer
          details.requestHeaders.push({ name: "Referer", value: referer });
          console.log(`Referer modifié pour ${details.url}: ${referer}`);
        }
      }
    } catch (err) {
      console.error("Erreur lors de la modification du referer:", err);
    }
  }
  
  return { requestHeaders: details.requestHeaders };
};

function getBrowserType() {
  if (typeof browser !== "undefined") {
    return "firefox";
  } else if (typeof chrome !== "undefined") {
    return "chrome";
  } else {
    return "unknown";
  }
}

console.log("L'extension tourne sur :", getBrowserType());

const browserType = getBrowserType();
const urls = ["*://*.europresse.com/*", "*://*.eureka.cc/*"];
const options = ["blocking", "requestHeaders"];

// Ajouter extraHeaders uniquement pour Chrome
if (browserType === 'chrome') {
  options.push("extraHeaders");
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  listener,{ urls: urls }, options
);

//======== Code pour l'ajout du menu de recherche contextuel sur une sélection de texte ========
function createEuropresseSearchMenu() {
  chrome.contextMenus.create(
      {
        id: "EuropresseSearchMenu",
        title: "Rechercher: %s",
        contexts: ["selection"],
      },
      onCreated,
  );

  chrome.contextMenus.onClicked.addListener( async (info,tab) => {
    switch (info.menuItemId) {
      case "EuropresseSearchMenu":
        console.log("EuropresseSearchMenu",tab);
        const search_request = info.selectionText;
        await chrome.storage.local.set({"EuropresseSearchMenu_request": search_request});
        const manifest = chrome.runtime.getManifest();
        const partners = manifest.browser_specific_settings.ophirofox_metadata.partners;
        const partner = partners.find(p => p.name === ophirofoxSettings.partner_name);
        chrome.tabs.create({
          url: partner.AUTH_URL
        });
        break;
    }
  });

  function onCreated() {
    if (chrome.runtime.lastError) {
      console.log(`Error: ${chrome.runtime.lastError}`);
    } else {
      console.log("EuropresseSearchMenu created successfully");
      isMenuCreated = true;
    }
  }
}

// ======== INITIALISATION ========

// Exécution initiale
injectEuropress();