const ophirofox_config_list = [
  class OphirofoxConfigULM {
    static domains = ["ens.fr"];
    static LOGIN_URL = "http://proxy.rubens.ens.fr/login";
    static AUTH_URL = // URL à charger pour pouvoir se logger sans mot de passe
      "https://proxy.rubens.ens.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=PSLT_1";
  },
  class OphirofoxConfigENSAM {
    static domains = ["ensam.eu"];
    static LOGIN_URL = "http://rp1.ensam.eu/login";
    static AUTH_URL =
      "https://rp1.ensam.eu/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=AML";
  },
];

/**
 * Get the config for a given domain
 * @param {string} domain
 */
function getOphirofoxConfigByDomain(domain) {
  return ophirofox_config_list.find(({ domains }) => domains.includes(domain));
}

async function getStorage(key) {
  return new Promise((accept, reject) => {
    chrome.storage.local.get([key], function (result) {
      if (result.hasOwnProperty(key)) accept(result[key]);
      else
        reject(
          new Error(
            `Key ${key} not found in extension storage: ${chrome.runtime.lastError}`
          )
        );
    });
  });
}

async function getOphirofoxConfig() {
  const url = new URL(window.location);
  const domain = url.host.split(".").slice(-2).join(".");
  // Si la page actuelle est spécifique à une configuration, alors on l'utilise
  let domain_match = getOphirofoxConfigByDomain(domain);
  if (domain_match) return domain_match;
  try {
    const default_domain = await getStorage("ophirofox_default_domain");
    domain_match = getOphirofoxConfigByDomain(default_domain);
    if (domain_match) return domain_match;
  } catch (err) {
    const fallback = ophirofox_config_list[0];
    console.warn(`No ophirofox domain found, using the default ${fallback.domains[0]}: ${err}`);
    return fallback;
  }
}

const ophirofox_config = getOphirofoxConfig();

/**
 * Crée un lien vers une recherche europresse pré-remplie avec les termes de recherche passés en argument
 * @param {string} keywords
 * @returns {URL}
 */
async function makeOphirofoxReadingLink(keywords) {
  const target_url = new URL("https://nouveau.europresse.com/Search/Reading");
  target_url.searchParams.set("ophirofox_source", window.location);
  target_url.searchParams.set("ophirofox_keywords", keywords);
  const config = await ophirofox_config;
  return new URL(`${config.LOGIN_URL}?url=${target_url}`);
}
