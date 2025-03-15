const europresse_content_script = {
  css: ["/content_scripts/europresse_article.css"],
  js: ["/content_scripts/europresse_article.js", "/content_scripts/europresse_search.js"]
};

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    chrome.runtime.openOptionsPage();
  }
});

function webNavigationListener({ tabId }) {
  europresse_content_script.js.forEach(file => chrome.tabs.executeScript(tabId, { file }));
  europresse_content_script.css.forEach(file => chrome.tabs.insertCSS(tabId, { file }));
}

/**
 * @param {string[]} europresse_origins 
 */
async function injectEuropressUsingWebNavigation(europresse_origins) {
  const url = europresse_origins.map(origin => ({ hostEquals: new URL(origin).hostname }));
  if (url.length === 0) return;
  console.log("Adding webNavigation listener", url);
  chrome.webNavigation.onDOMContentLoaded.addListener(webNavigationListener, { url });
}

/**
 * @param {string[]} matches 
 */
async function injectEuropressUsingScripting(matches) {
  const content_script = { ...europresse_content_script, matches, id: "europresse" };
  await unregisterContentScripts();
  await registerContentScripts(content_script);
  console.log("Injected Europress using scripting", matches);
}

async function unregisterContentScripts() {
  try {
    await new Promise(acc => chrome.scripting.unregisterContentScripts({ ids: ["europresse"] }, acc));
    console.log("Unregistered old content script");
  } catch (err) {
    console.log("No old content script unregistered", err);
  }
}

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

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    const url = new URL(details.url);
    const isTargetHost = url.hostname.includes("europresse.com") || url.hostname.includes("eureka.cc");
    const isTargetPath = url.pathname.startsWith("/access/httpref/default.aspx");
    
    if (isTargetHost && isTargetPath) {
      return new Promise((resolve) => {
        chrome.storage.local.get(
          ["ophirofox_request_type", "ophirofox_readPDF_request", "ophirofox_settings"], 
          function(data) {
            const hasRequestType = data.ophirofox_request_type !== undefined;
            const hasReadPDFRequest = data.ophirofox_readPDF_request !== undefined;
            const hasConsumable = hasRequestType || hasReadPDFRequest;
            if (hasConsumable) {
              let referer = null;
              if (data.ophirofox_settings) {
                try {
                  const settings = typeof data.ophirofox_settings === 'string' 
                    ? JSON.parse(data.ophirofox_settings) 
                    : data.ophirofox_settings;
                  const partner_name = settings.partner_name;
                  const manifest = chrome.runtime.getManifest();
                  const partners = manifest.browser_specific_settings.ophirofox_metadata.partners;
                  const partner = partners.find(p => p.name === partner_name);
                  
                  if (partner && partner.AUTH_URL) {
                    const authUrl = new URL(partner.AUTH_URL);
                    referer = `${authUrl.protocol}//${authUrl.hostname}`;
                  }
                } catch (err) {
                  console.error("Erreur lors de la détermination du referer:", err);
                }
              }
              
              // Si un referer est déterminé, modifions l'en-têt
              if (referer) {
                // Chercher l'en-tête Referer existant ou en ajouter un nouveau
                let refererHeader = details.requestHeaders.find(header => header.name.toLowerCase() === "referer");
                  
                if (refererHeader) {
                  refererHeader.value = referer;
                } else {
                  details.requestHeaders.push({ name: "Referer", value: referer });
                }
                console.log(`Referer modifié pour ${details.url}: ${referer}`);
              }
            } else {
              console.log("Aucun consommable trouvé, referer non modifié");
            }
            resolve({ requestHeaders: details.requestHeaders });
          }
        );
      });
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["*://*.europresse.com/*", "*://*.eureka.cc/*"] },
  ["blocking", "requestHeaders"]
);

// update injection on permission change
chrome.permissions.onAdded.addListener(injectEuropress);
chrome.permissions.onRemoved.addListener(injectEuropress);
chrome.storage.onChanged.addListener(injectEuropress);
injectEuropress();
