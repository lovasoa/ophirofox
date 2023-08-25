const ophirofox_config_list = chrome.runtime.getManifest().browser_specific_settings.ophirofox_metadata.partners;

/**
 * Get the config with the given name
 * @param {string} search_name
 */
function getOphirofoxConfigByName(search_name) {
  return ophirofox_config_list.find(({ name }) => search_name === name);
}

const DEFAULT_SETTINGS = {
  partner_name: "BNF",
};

const OPHIROFOX_SETTINGS_KEY = "ophirofox_settings";

/**
 * @returns {Promise<typeof DEFAULT_SETTINGS>}
 */
async function getSettings() {
  const key = OPHIROFOX_SETTINGS_KEY;
  return new Promise((accept) => {
    chrome.storage.local.get([key], function (result) {
      if (result.hasOwnProperty(key)) accept(JSON.parse(result[key]));
      else {
        console.error(
          new Error(
            `Key ${key} not found in extension storage: ${chrome.runtime.lastError}`
          )
        );
        accept(DEFAULT_SETTINGS);
      }
    });
  });
}

/**
 * @param {typeof DEFAULT_SETTINGS} settings
 */
async function setSettings(settings) {
  return new Promise((accept) => {
    chrome.storage.local.set(
      { [OPHIROFOX_SETTINGS_KEY]: JSON.stringify(settings) },
      accept
    );
  });
}

async function getOphirofoxConfig() {
  const url = new URL(window.location);
  try {
    const { partner_name } = await getSettings();
    const name_match = getOphirofoxConfigByName(partner_name);
    if (name_match) return name_match;
  } catch (err) {
    console.warn(
      `No ophirofox domain found, using the default ${fallback.name}: ${err}`
    );
  }
  const fallback = ophirofox_config_list[0];
  return fallback;
}

const ophirofox_config = getOphirofoxConfig();

/**
 * Crée un lien vers Europresse avec les keywords donnés
 * @param {string} keywords
 * @returns {Promise<HTMLAnchorElement>}
 */
async function ophirofoxEuropresseLink(keywords) {
  keywords = keywords ? keywords.trim() : document.querySelector("h1").textContent;
  const a = document.createElement("a");
  a.textContent = "Lire sur Europresse";
  a.className = "ophirofox-europresse";
  const setKeywords = () => new Promise(accept =>
    chrome.storage.local.set({ "ophirofox_keywords": keywords }, accept));
  a.onmousedown =  setKeywords;
  a.onclick = async function (evt) {
    evt.preventDefault();
    const [{AUTH_URL}] = await Promise.all([ophirofox_config, setKeywords()]);
    window.location = AUTH_URL
  }
  ophirofox_config.then(({ AUTH_URL }) => { a.href = AUTH_URL });
  return a;
}
