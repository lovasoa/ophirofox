const manifest = chrome.runtime.getManifest();

/**
 * @type {{AUTH_URL:string, name:string}[]}}
 */
const ophirofox_config_list = manifest.browser_specific_settings.ophirofox_metadata.partners;

/**
 * Get the config with the given name
 * @param {string} search_name
 */
function getOphirofoxConfigByName(search_name) {
  return ophirofox_config_list.find(({ name }) => search_name === name);
}

const DEFAULT_SETTINGS = {
  partner_name: "Pas d'intermédiaire",
};

let current_settings = DEFAULT_SETTINGS;

const OPHIROFOX_SETTINGS_KEY = "ophirofox_settings";

/**
 * @returns {Promise<typeof DEFAULT_SETTINGS>}
 */
async function getSettings() {
  const key = OPHIROFOX_SETTINGS_KEY;
  return new Promise((accept) => {
    chrome.storage.local.get([key], function (result) {
      if (result.hasOwnProperty(key)) {
        current_settings = JSON.parse(result[key]);
        accept(current_settings);
      }
      else accept(DEFAULT_SETTINGS);
    });
  });
}

/**
 * @param {typeof DEFAULT_SETTINGS} settings
 */
async function setSettings(settings) {
  current_settings = settings;
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
  a.onmousedown = setKeywords;
  a.onclick = async function (evt) {
    evt.preventDefault();
    const [{ AUTH_URL }] = await Promise.all([ophirofox_config, setKeywords()]);
    window.location = AUTH_URL
  }
  ophirofox_config.then(({ AUTH_URL }) => { a.href = AUTH_URL });
  return a;
}

/**
 * @param {{AUTH_URL:string}} partner 
 * @returns {string} the top domain of the AUTH_URL
 */
function partnerTopDomain({ AUTH_URL }) {
  const auth_url_domain = new URL(AUTH_URL).hostname;
  const auth_url_domain_parts = auth_url_domain.split(".");
  return auth_url_domain_parts.slice(-2).join(".");
}

/**
 * @param {string} partner_name 
 */
function makePermissionsRequest(partner_name) {
  const partner = ophirofox_config_list.find(({ name }) => name === partner_name);
  if (!partner) throw new Error(`No partner found with name ${partner_name}`);
  const auth_url_domain = partnerTopDomain(partner);
  const optional_permissions = manifest.optional_permissions;
  const optional_permission_for_auth_url = optional_permissions.find((permission) => {
    try {
      const url = new URL(permission);
      return url.hostname.endsWith(auth_url_domain);
    } catch (_) { }
  });
  if (!optional_permission_for_auth_url) throw new Error(`No permission found for ${auth_url_domain}`);
  return { permissions: missing_permissions, origins: [optional_permission_for_auth_url] };
}

/**
 * @param {string} partner_name 
 * @returns {Promise<boolean>} true if the permissions are present
 **/
function ophirofoxCheckPermissions(partner_name) {
  try {
    const perms = makePermissionsRequest(partner_name);
    return new Promise((accept) => chrome.permissions.contains(perms, accept));
  } catch (err) {
    console.warn(err);
    return Promise.resolve(false);
  }
}

/**
 * @param {string} partner_name 
 * @returns {Promise<void>} true if the permissions are prsent
 * @throws {Error} if the permissions are not granted
 **/
async function ophirofoxAskPermissions(partner_name) {
  const granted = await new Promise(a => chrome.permissions.request(makePermissionsRequest(partner_name), a));
  if (!granted) throw new Error("Permission not granted");
}

const missing_permissions = [];

// Returns a list of permissions that must be asked for.
// This extension can use either the "scripting" permission (available in firefox), or "webNavigation" (in chrome) 
async function requiredAdditionalPermissions() {
  const { permissions } = await new Promise((accept) => chrome.permissions.getAll(accept));
  // if we already have "scripting", we don't need anything else
  if (!permissions.includes("scripting") && !permissions.includes("webNavigation")) missing_permissions.push("webNavigation");
  else missing_permissions.length = 0;
  return missing_permissions;
}

requiredAdditionalPermissions();