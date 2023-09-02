chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    chrome.runtime.openOptionsPage();
  }
});

async function injectEuropressUsingWebNavigation(europresse_origins) {
  function onVisitEuropress({ tabId }) {
    chrome.tabs.executeScript(tabId, { file: "/content_scripts/europresse_search.js" });
    chrome.tabs.executeScript(tabId, { file: "/content_scripts/europresse_article.js" });
    chrome.tabs.insertCSS(tabId, { file: "/content_scripts/europresse_article.css" });
  }
  const url = europresse_origins.map(origin => ({ hostEquals: new URL(origin).hostname }));
  if (url.length === 0) return;
  chrome.webNavigation.onDOMContentLoaded.addListener(onVisitEuropress, { url });
}

async function injectEuropressUsingScripting(matches) {
  console.log("Injecting Europress using scripting", matches);
  chrome.scripting.registerContentScripts(
    [{
      id: "europresse",
      matches,
      js: ["/content_scripts/europresse_search.js", "/content_scripts/europresse_article.js"],
      css: ["/content_scripts/europresse_article.css"],
    }]
  )
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
