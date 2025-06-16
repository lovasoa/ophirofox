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
  open_links_new_tab: false,
  auto_open_link: false,
  add_search_menu: false,
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
 * @param {string} keywords - input for Europress search engine
 * @param {string} publishedTime - article publication date (i.e. 2024-08-27T18:18:55.663Z or 2024-08-27)
 * @returns {Promise<HTMLAnchorElement>}
 */
async function ophirofoxEuropresseLink(keywords, { publishedTime } = {}) {
  keywords = keywords ? keywords.trim() : document.querySelector("h1").textContent;

  publishedTime = publishedTime || document.querySelector("meta[property='article:published_time'], meta[property='og:article:published_time'], meta[property='date:published_time']")
    ?.getAttribute("content") || '';
  let publishedTimeInstance = new Date(publishedTime);

  if (!isNaN(publishedTimeInstance)) {
    publishedTime = publishedTimeInstance.toISOString().slice(0, 10);
  } else {
    publishedTime = '';
  }

  const a = document.createElement("a");
  a.textContent = "Lire sur Europresse";
  a.className = "ophirofox-europresse";

  const setKeywords = () => new Promise(accept => {
    Promise.all([
      chrome.storage.local.set({
        "ophirofox_request_type": { 'type': 'read' }
      }),
      chrome.storage.local.set({
        "ophirofox_read_request": {
          'search_terms': keywords,
          'published_time': publishedTime
        }
      }),
    ]).then(() => accept());
  });

  a.onmousedown = setKeywords;
  a.onclick = async function (evt) {
    evt.preventDefault();
    const [{ AUTH_URL }, settings] = await Promise.all([ophirofox_config, getSettings()]);
    if (settings.open_links_new_tab) {
      window.open(AUTH_URL, "_blank");
    } else {
      window.location = AUTH_URL;
    }
  };

  ophirofox_config.then(({ AUTH_URL }) => { a.href = AUTH_URL });
  return a;
}

/**
 * Crée un lien vers Europresse pour la consultation de PDF, avec l'id du media, et la date de parution
 * @param {string} media_id
 * @param {string} publishedTime
 * @returns {Promise<HTMLAnchorElement>}
 */
async function ophirofoxEuropressePDFLink(media_id, publishedTime) {
  const a = document.createElement("a");
  a.textContent = "Lire sur Europresse";
  a.className = "ophirofox-europresse";

  const setKeywords = () => new Promise(accept => {
    Promise.all([
      chrome.storage.local.set({
        "ophirofox_request_type": { 'type': 'readPDF' }
      }),
      chrome.storage.local.set({
        "ophirofox_readPDF_request": {
          'media_id': media_id,
          'published_time': publishedTime
        }
      }),
    ]).then(() => accept());
  });

  a.onmousedown = setKeywords;
  a.onclick = async function (evt) {
    evt.preventDefault();
    const [{ AUTH_URL }, settings] = await Promise.all([ophirofox_config, getSettings()]);
    if (settings.open_links_new_tab) {
      window.open(AUTH_URL, "_blank");
    } else {
      window.location = AUTH_URL;
    }
  };

  ophirofox_config.then(({ AUTH_URL }) => { a.href = AUTH_URL });
  return a;
}

/**
 * Finds the permission that matches the AUTH_URL of the given partner
 * by finding the permission URL that has the longest matching suffix
 * 
 * For instance, if the AUTH_URL is "https://a.b.c.d.com/auth", and the manifest
 * contains the permissions "https://b.c.d.com", "https://c.d.com", and "https://x.com"
 * then this function will return "https://b.c.d.com"
 * @param {{AUTH_URL:string}} partner
 * @returns {string} the permission
 */
function permissionForPartner({ AUTH_URL }) {
  const auth_url_host = new URL(AUTH_URL).hostname.split('.');
  const all_permissions = [...manifest.permissions, ...manifest.optional_permissions];
  let { permission, match_length } = all_permissions.reduce((best, permission) => {
    let permission_host = "";
    try {
      permission_host = new URL(permission).hostname;
    } catch (_) { // ignore permissions that are not URLs
      return best;
    }
    let match_length = 0;
    let host_parts = permission_host.split(".");
    for (let i = 0; i < auth_url_host.length && i < host_parts.length; i++) {
      let part = host_parts[host_parts.length - 1 - i];
      let auth_part = auth_url_host[auth_url_host.length - 1 - i];
      if (part !== auth_part) break;
      match_length = i;
    }
    if (match_length > best.match_length) {
      return { permission, match_length };
    } else return best;
  }, { permission: "", match_length: -1 });
  if (match_length < 2) { // no match for the top level domain
    console.log(`No permission found for ${AUTH_URL}, will return the first URL permission (${permission})`);
  }
  return permission;
}

 /**
 * Makes a permissions request for the specified partner by checking
 * if a PROXY_URL exists or falling back to a generic matching logic based on AUTH_URL.
 *
 * @param {string} partner_name
 * @returns {{permissions: string[], origins: string[]}}
 */
function makePermissionsRequest(partner_name) {
  const partner = ophirofox_config_list.find(({ name }) => name === partner_name);
  if (!partner) throw new Error(`No partner found with name ${partner_name}`);

  let permission = partner.PROXY_URL;
  if (!permission) {
    permission = permissionForPartner(partner);
  }

  if (!permission) throw new Error(`No valid permission found for partner "${partner_name}"`);

  return { permissions: missing_permissions, origins: [permission] };
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

  // remove other partner permission
  chrome.permissions.getAll(async all => {
        chrome.permissions.remove({
          permissions: [],
          origins: all.origins
        }, function (removed) {
          if (removed) {
            console.log("Permission is removed");
          } else {
            console.log("Permission is not removed");
          }
        });
      }
  );

  const perm_request = makePermissionsRequest(partner_name);
  const granted = await new Promise(a => chrome.permissions.request(perm_request, a)) ||
    // the permissions may have been granted before, so if we have them now anyway, we're good
    await new Promise((accept) => chrome.permissions.contains(perm_request, accept));
  if (!granted) throw new Error("Permission not granted");
}

/**
 * @description check if user plugin config match website specific config
 * @param {string[]} configNames names of partners in manifest.js
 * @return {{AUTH_URL:string, name:string,AUTH_URL_NAMEOFWEBSITE:string}} current config with specific property as defined in manifest.js
 */
async function configurationsSpecifiques(configNames){
  const config = await ophirofox_config;
  if (configNames.find((name) => name === config.name)) return config
}

const missing_permissions = [];

// Returns a list of permissions that must be asked for.
// This extension can use either the "scripting" permission (available in firefox), or "webNavigation" (in chrome) 
async function requiredAdditionalPermissions() {
  if (!chrome.permissions) return [];
  const { permissions } = await new Promise((accept) => chrome.permissions.getAll(accept));
  // if we already have "scripting", we don't need anything else
  if (!permissions.includes("scripting") && !permissions.includes("webNavigation")) missing_permissions.push("webNavigation");
  else missing_permissions.length = 0;
  return missing_permissions;
}

requiredAdditionalPermissions();

// ======== Si le navigateur fonctionne sous Android l'on ne montre pas l'option menu recherche ========
async function onLoad(){
  if (isNotAndroid()) {
    let addSearchMenu = document.getElementById("add_search_label");
    addSearchMenu.style.display = "block";
  }
}

function isNotAndroid() {
  return !/Android/.test(navigator.userAgent);
}

onLoad().catch(console.error);