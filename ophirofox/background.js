// Variables globales pour le Service Worker
let ophirofoxSettings = null;
let ophirofoxReadRequest = null;
let ophirofoxRequestType = null;
let searchMenu = null;
let declarativeRulesInitialized = false;

// Configuration des scripts de contenu
const europresse_content_script = {
  css: ["/content_scripts/europresse_article.css"],
  js: ["/content_scripts/europresse_article.js", "/content_scripts/europresse_search.js"]
};

// ======== FONCTIONS DE GESTION DES PARAMÈTRES ========

/**
 * Charge les paramètres depuis le stockage local
 */
async function loadSettings() {
  try {
    const data = await chrome.storage.local.get(["ophirofox_settings"]);
    if (data.ophirofox_settings) {
      ophirofoxSettings = typeof data.ophirofox_settings === "string"
        ? JSON.parse(data.ophirofox_settings)
        : data.ophirofox_settings;
      
      if (!/Android/.test(navigator.userAgent)) {
        if (ophirofoxSettings.add_search_menu && searchMenu === null) {
          console.log(`createEuropresseSearchMenu`);
          await createEuropresseSearchMenu();
        } else if (!ophirofoxSettings.add_search_menu && searchMenu !== null) {
          await removeEuropresseSearchMenu();
        }
      }
      console.log("Settings chargés :", ophirofoxSettings);
    }
  } catch (err) {
    console.error("Erreur lors du chargement des settings :", err);
  }
}

/**
 * Charge les données de requête depuis le stockage
 */
async function loadRequestData() {
  try {
    const data = await chrome.storage.local.get(["ophirofox_request_type", "ophirofox_read_request"]);
    ophirofoxRequestType = data.ophirofox_request_type || null;
    ophirofoxReadRequest = data.ophirofox_read_request || null;
    console.log("Valeurs initiales chargées:", { ophirofoxRequestType, ophirofoxReadRequest });
  } catch (err) {
    console.error("Erreur lors du chargement des données de requête:", err);
  }
}

// ======== GESTION DES RÈGLES DECLARATIVENETREQUEST ========

/**
 * Génère les règles statiques pour declarativeNetRequest basées sur les partenaires
 */
async function generateDeclarativeRules() {
  try {
    const manifest = chrome.runtime.getManifest();
    const partners = manifest.browser_specific_settings?.ophirofox_metadata?.partners || [];
    
    // Filtrer les partenaires qui ont une AUTH_URL avec httpref
    const httprefPartners = partners.filter(partner => 
      partner.AUTH_URL && partner.AUTH_URL.includes('/access/httpref/default.aspx')
    );
    
    console.log(`Partenaires avec httpref trouvés: ${httprefPartners.length}`);
    
    const rules = [];
    let ruleId = 1;
    
    for (const partner of httprefPartners) {
      try {
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
          rules.push({
            id: ruleId++,
            condition: {
              urlFilter: "*://nouveau.europresse.com/access/httpref/default.aspx*",
              initiatorDomains: [new URL(referer).hostname]
            },
            action: {
              type: "modifyHeaders",
              requestHeaders: [
                {
                  header: "referer",
                  operation: "set",
                  value: referer
                }
              ]
            }
          });
          
          // Ajouter une règle pour eureka.cc aussi
          rules.push({
            id: ruleId++,
            condition: {
              urlFilter: "*://eureka.cc/access/httpref/default.aspx*",
              initiatorDomains: [new URL(referer).hostname]
            },
            action: {
              type: "modifyHeaders",
              requestHeaders: [
                {
                  header: "referer",
                  operation: "set",
                  value: referer
                }
              ]
            }
          });
          
          console.log(`Règle créée pour ${partner.name}: ${referer}`);
        }
      } catch (err) {
        console.error(`Erreur lors de la création de la règle pour ${partner.name}:`, err);
      }
    }
    
    if (rules.length > 0) {
      // Supprimer toutes les règles existantes et ajouter les nouvelles
      const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
      const existingRuleIds = existingRules.map(rule => rule.id);
      
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existingRuleIds,
        addRules: rules
      });
      
      console.log(`${rules.length} règles declarativeNetRequest installées`);
    }
    
    declarativeRulesInitialized = true;
  } catch (err) {
    console.error("Erreur lors de la génération des règles declarativeNetRequest:", err);
  }
}

// ======== FONCTIONS D'INJECTION DE SCRIPTS ========

/**
 * Fonction exécutée lors de la navigation (fallback pour webNavigation)
 * @param {Object} param0 - Objet contenant l'ID de l'onglet
 */
async function webNavigationListener({ tabId }) {
  try {
    for (const file of europresse_content_script.js) {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: [file]
      });
    }
    for (const file of europresse_content_script.css) {
      await chrome.scripting.insertCSS({
        target: { tabId },
        files: [file]
      });
    }
  } catch (err) {
    console.error("Erreur lors de l'injection via webNavigation:", err);
  }
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
    await chrome.scripting.unregisterContentScripts({ ids: ["europresse"] });
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
    await chrome.scripting.registerContentScripts([content_script]);
    console.log("Registered new content script");
  } catch (err) {
    // Fallback pour les anciennes versions de Firefox
    content_script.persistAcrossSessions = false;
    await chrome.scripting.registerContentScripts([content_script]);
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
  try {
    const permissions = await chrome.permissions.getAll();
    const { origins } = permissions;
    const europresse_origins = origins.filter(origin => /europresse|eureka/.test(origin));
    
    if (permissions.permissions.includes("scripting") && europresse_origins.length > 0) {
      await injectEuropressUsingScripting(europresse_origins);
    } else if (permissions.permissions.includes("webNavigation") && europresse_origins.length > 0) {
      await injectEuropressUsingWebNavigation(europresse_origins);
    } else {
      console.log("No permission to inject Europress at the moment, opening options page");
      chrome.runtime.openOptionsPage();
    }
    
    // Initialiser les règles declarativeNetRequest si pas encore fait
    if (!declarativeRulesInitialized) {
      await generateDeclarativeRules();
    }
  } catch (err) {
    console.error("Erreur lors de l'injection Europress:", err);
  }
}

// ======== GESTION DU MENU CONTEXTUEL ========

/**
 * Crée le menu de recherche contextuel
 */
async function createEuropresseSearchMenu() {
  try {
    searchMenu = await chrome.contextMenus.create({
      id: "EuropresseSearchMenu",
      title: "Rechercher: %s",
      contexts: ["selection"],
    });
    console.log("EuropresseSearchMenu created successfully");
  } catch (err) {
    console.error(`Error creating context menu: ${err}`);
  }
}

/**
 * Supprime le menu de recherche contextuel
 */
async function removeEuropresseSearchMenu() {
  try {
    if (searchMenu) {
      await chrome.contextMenus.remove(searchMenu);
      searchMenu = null;
      console.log(`removeEuropresseSearchMenu`);
    }
  } catch (err) {
    console.error("Erreur lors de la suppression du menu:", err);
  }
}

/**
 * Gestionnaire de clic sur le menu contextuel
 */
async function onSearchMenuClickHandler(info, tab) {
  try {
    if (info.menuItemId === "EuropresseSearchMenu") {
      console.log("EuropresseSearchMenu", tab);
      const search_request = info.selectionText;
      
      await Promise.all([
        chrome.storage.local.set({
          "ophirofox_request_type": { 'type': 'SearchMenu' }
        }),
        chrome.storage.local.set({
          "ophirofox_read_request": {
            'search_terms': search_request,
            'published_time': ''
          }
        }),
      ]);
      
      // Recharger les settings si nécessaire
      if (!ophirofoxSettings) {
        await loadSettings();
      }
      
      if (ophirofoxSettings && ophirofoxSettings.partner_name) {
        const manifest = chrome.runtime.getManifest();
        const partners = manifest.browser_specific_settings?.ophirofox_metadata?.partners || [];
        const partner = partners.find(p => p.name === ophirofoxSettings.partner_name);
        
        if (partner && partner.AUTH_URL) {
          await chrome.tabs.create({ url: partner.AUTH_URL });
        }
      }
    }
  } catch (err) {
    console.error("Erreur dans onSearchMenuClickHandler:", err);
  }
}

// ======== ÉCOUTEURS D'ÉVÉNEMENTS ========

// Installation et démarrage
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  try {
    if (reason === "install") {
      chrome.runtime.openOptionsPage();
    }
    await loadSettings();
    await loadRequestData();
    await injectEuropress();
  } catch (err) {
    console.error("Erreur lors de l'installation:", err);
  }
});

chrome.runtime.onStartup.addListener(async () => {
  try {
    await loadSettings();
    await loadRequestData();
    await injectEuropress();
  } catch (err) {
    console.error("Erreur lors du démarrage:", err);
  }
});

// Gestion des permissions
chrome.permissions.onAdded.addListener(injectEuropress);
chrome.permissions.onRemoved.addListener(injectEuropress);

// Gestion des changements de stockage
chrome.storage.onChanged.addListener(async (changes, area) => {
  try {
    if (area === "local") {
      if (changes.ophirofox_settings) {
        await loadSettings();
        await injectEuropress();
      }
      if (changes.ophirofox_request_type) {
        ophirofoxRequestType = changes.ophirofox_request_type.newValue || null;
      }
      if (changes.ophirofox_read_request) {
        ophirofoxReadRequest = changes.ophirofox_read_request.newValue || null;
      }
    }
  } catch (err) {
    console.error("Erreur lors du traitement des changements de stockage:", err);
  }
});

// Gestion des clics sur le menu contextuel
chrome.contextMenus.onClicked.addListener(onSearchMenuClickHandler);

// Détecter le type de navigateur
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

// ======== INITIALISATION AU DÉMARRAGE DU SERVICE WORKER ========

// Initialisation immédiate lors du démarrage du service worker
(async function initializeServiceWorker() {
  try {
    await loadSettings();
    await loadRequestData();
    await injectEuropress();
  } catch (err) {
    console.error("Erreur lors de l'initialisation du service worker:", err);
  }
})();