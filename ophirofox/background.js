// ======== VARIABLES GLOBALES ========
let ophirofoxSettings;
let ophirofoxReadRequest = null;
let ophirofoxRequestType = null;
let tabEuropresseData = {};
let premiumUrls = new Map();

// Configuration des scripts de contenu
const europresse_content_script = {
  css: ["/content_scripts/europresse_article.css"],
  js: ["/content_scripts/europresse_article.js", "/content_scripts/europresse_search.js"]
};

// ======== FONCTIONS UTILITAIRES ========

/**
 * Détermine le type de navigateur utilisé
 * @returns {string} - Type de navigateur ('firefox', 'chrome', ou 'unknown')
 */
function getBrowserType() {
  if (typeof browser !== "undefined") {
    return "firefox";
  } else if (typeof chrome !== "undefined") {
    return "chrome";
  } else {
    return "unknown";
  }
}

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
        console.log("Settings chargés :", ophirofoxSettings);
      } catch (err) {
        console.error("Erreur lors du chargement des settings :", err);
      }
    }
  });
}

/**
 * Charge les données de requête depuis le stockage local
 */
function loadRequestData() {
  chrome.storage.local.get(["ophirofox_request_type", "ophirofox_read_request"], function(data) {
    ophirofoxRequestType = data.ophirofox_request_type || null;
    ophirofoxReadRequest = data.ophirofox_read_request || null;
    console.log("Valeurs initiales chargées:", { ophirofoxRequestType, ophirofoxReadRequest });
  });
}

/**
 * Récupère les paramètres actuels
 * @returns {Promise<Object>} - Promesse résolue avec les paramètres
 */
function getSettings() {
  return new Promise(resolve => {
    chrome.storage.local.get(["ophirofox_settings"], result => {
      if (result.ophirofox_settings) {
        try {
          resolve(typeof result.ophirofox_settings === "string" 
            ? JSON.parse(result.ophirofox_settings) 
            : result.ophirofox_settings);
        } catch (err) {
          console.error("Erreur lors du parsing des settings:", err);
          resolve({});
        }
      } else {
        resolve({});
      }
    });
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

// ======== FONCTIONS DE GESTION DE PAGE ACTION ========

/**
 * Met à jour la visibilité de l'icône dans la barre de recherche pour tous les onglets
 * @param {boolean} show - Indique si l'icône doit être affichée
 */
function updatePageActionVisibility(show) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (show) {
        chrome.pageAction.show(tab.id);
      } else {
        chrome.pageAction.hide(tab.id);
      }
    });
  });
}

/**
 * Initialise la visibilité de l'icône dans la barre de recherche selon les paramètres
 */
function initializePageAction() {
  getSettings().then((settings) => {
    updatePageActionVisibility(settings.show_page_action !== false);
  });
}

// ======== INTERCEPTEUR DE REQUÊTES HTTP ========

/**
 * Écouteur pour modifier les en-têtes des requêtes HTTP
 * @param {Object} details - Détails de la requête
 * @returns {Object} - En-têtes modifiés
 */
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
      
      if (partner && partner.AUTH_URL) {
        const authUrl = new URL(partner.AUTH_URL);
        const referer = `${authUrl.protocol}//${authUrl.hostname}`;
        // Supprime l'en-tête Referer existant
        details.requestHeaders = details.requestHeaders.filter(h => h.name.toLowerCase() !== "referer");
        // Ajoute un nouvel en-tête Referer
        details.requestHeaders.push({ name: "Referer", value: referer });
        console.log(`Referer modifié pour ${details.url}: ${referer}`);
      }
    } catch (err) {
      console.error("Erreur lors de la modification du referer:", err);
    }
  }
  
  return { requestHeaders: details.requestHeaders };
};

// ======== ÉCOUTEURS D'ÉVÉNEMENTS ========

// Événements du cycle de vie de l'extension
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    chrome.runtime.openOptionsPage();
  }
  loadSettings();
});

chrome.runtime.onStartup.addListener(loadSettings);

// Événements de permissions
chrome.permissions.onAdded.addListener(injectEuropress);
chrome.permissions.onRemoved.addListener(injectEuropress);

// Événements de stockage
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") {
    if (changes.ophirofox_settings) {
      loadSettings();
    }
    if (changes.ophirofox_request_type) {
      ophirofoxRequestType = changes.ophirofox_request_type.newValue || null;
    }
    if (changes.ophirofox_read_request) {
      ophirofoxReadRequest = changes.ophirofox_read_request.newValue || null;
    }
  }
  injectEuropress();
});

// Événements de messages runtime
chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.action === "updatePageAction") {
    updatePageActionVisibility(message.show);
    return false;
  }
  
  if (!sender.tab) return false;
  const tabId = sender.tab.id;
  const url = sender.tab.url;

  const settings = await getSettings();
  
  if (message.premiumContent === true) {
    premiumUrls.set(url, true);
    if (settings?.show_page_action !== false) {
      chrome.pageAction.show(tabId);
    }
  } else if (message.premiumContent === false) {
    premiumUrls.delete(url);
    chrome.pageAction.hide(tabId);
  }
  
  if (message.europresseData) {
    tabEuropresseData[tabId] = message.europresseData;
  }

  return false;
});

// Événements d'onglets
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url || changeInfo.status === 'complete') {
    const settings = await getSettings();
    // console.log("Settings retrieved:", settings);

    if (settings?.show_page_action !== false) {
      const url = tab.url;
      // console.log("Premium URL check:", url, premiumUrls);
      if (premiumUrls.has(url)) {
        chrome.pageAction.show(tabId);
      }
    } else {
      chrome.pageAction.hide(tabId);
    }
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabEuropresseData[tabId];
});

// Événement de clic sur l'icône dans la barre de recherche
chrome.pageAction.onClicked.addListener(async (tab) => {
  const tabId = tab.id;
  const data = tabEuropresseData[tabId];
  
  if (data) {
    try {
      // First, set the keywords (equivalent to onmousedown)
      await Promise.all([
        chrome.storage.local.set({
          "ophirofox_request_type": { 'type': 'read' }
        }),
        chrome.storage.local.set({
          "ophirofox_read_request": {
            'search_terms': data.keywords,
            'published_time': data.publishedTime
          }
        })
      ]);
      
      // Récupérer les paramètres de l'utilisateur
      const settings = await getSettings();
      
      // Récupérer la configuration du manifeste
      const manifest = chrome.runtime.getManifest();
      const partners = manifest.browser_specific_settings.ophirofox_metadata.partners;
      
      // Trouver le partenaire correspondant
      const partnerName = settings.partner_name || "Pas d'intermédiaire";
      const partner = partners.find(p => p.name === partnerName) || partners[0];
      
      // Utiliser l'AUTH_URL du partenaire
      if (partner && partner.AUTH_URL) {
        // Respecter le paramètre open_links_new_tab
        if (settings.open_links_new_tab) {
          chrome.tabs.create({ url: partner.AUTH_URL });
        } else {
          chrome.tabs.update(tabId, { url: partner.AUTH_URL });
        }
      } else {
        console.error("Aucune AUTH_URL trouvée pour le partenaire:", partnerName);
      }
    } catch (error) {
      console.error("Erreur dans le gestionnaire d'action de page:", error);
    }
  }
});

// ======== CONFIGURATION DE L'INTERCEPTEUR DE REQUÊTES ========

console.log("L'extension tourne sur :", getBrowserType());

const browserType = getBrowserType();
const urls = ["*://*.europresse.com/*", "*://*.eureka.cc/*"];
const options = ["blocking", "requestHeaders"];

// Ajouter extraHeaders uniquement pour Chrome
if (browserType === 'chrome') {
  options.push("extraHeaders");
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  listener, { urls: urls }, options
);

// ======== INITIALISATION ========

loadRequestData();
injectEuropress();
initializePageAction();