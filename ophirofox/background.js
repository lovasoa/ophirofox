const europresse_content_script = {
  css: ["/content_scripts/europresse_article.css"],
  js: ["/content_scripts/europresse_article.js", "/content_scripts/europresse_search.js"]
};

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    chrome.runtime.openOptionsPage();
  }
});

/**
 * @param {string[]} europresse_origins 
 */
async function injectEuropressUsingWebNavigation(europresse_origins) {
  const url = europresse_origins.map(origin => ({ hostEquals: new URL(origin).hostname }));
  if (url.length === 0) return;
  chrome.webNavigation.onDOMContentLoaded.addListener(({ tabId }) => {
    console.log("Injecting Europress using webNavigation", url);
    europresse_content_script.js.forEach(file => chrome.tabs.executeScript(tabId, { file }));
    europresse_content_script.css.forEach(file => chrome.tabs.insertCSS(tabId, { file }));
  }, { url });
}

/**
 * @param {string[]} matches 
 */
async function injectEuropressUsingScripting(matches) {
  console.log("Injecting Europress using scripting", matches);
  chrome.scripting.registerContentScripts([{ ...europresse_content_script, matches, id: "europresse" }])
}

async function injectEuropress() {
  chrome.permissions.getAll(({ origins, permissions }) => {
    const europresse_origins = origins.filter(origin => origin.includes("nouveau-europresse-com"));
    if (permissions.includes("scripting")) {
      injectEuropressUsingScripting(europresse_origins);
    } else if (permissions.includes("webNavigation")) {
      injectEuropressUsingWebNavigation(europresse_origins);
    } else {
      console.log("No permission to inject Europress at the moment");
    }
  });
}

// update injection on permission change
chrome.permissions.onAdded.addListener(injectEuropress);
chrome.permissions.onRemoved.addListener(injectEuropress);
injectEuropress();
