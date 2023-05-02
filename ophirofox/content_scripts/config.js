const ophirofox_config_list = [
  {
    name: "ULM",
    domains: ["ens.fr"],
    LOGIN_URL: "http://proxy.rubens.ens.fr/login",
    // URL à charger pour pouvoir se logger sans mot de passe
    AUTH_URL:
      "https://proxy.rubens.ens.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=PSLT_1",
  },
  {
    name: "ENSAM",
    domains: ["ensam.eu"],
    LOGIN_URL: "http://rp1.ensam.eu/login",
    AUTH_URL:
      "https://rp1.ensam.eu/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=AML",
  },
  {
    name: "Université Paris-Saclay",
    domains: ["universite-paris-saclay.fr"],
    LOGIN_URL: "https://proxy.scd.u-psud.fr/login",
    AUTH_URL:
      "https://proxy.scd.u-psud.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=U031535T_9",
  },
  {
    name: "INSA Lyon",
    domains: ["insa-lyon.fr"],
    LOGIN_URL: "https://docelec.insa-lyon.fr/login",
    AUTH_URL:
      "https://docelec.insa-lyon.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=INSAT_3",
  },
  {
    name: "BNF",
    domains: ["bnf.fr"],
    LOGIN_URL: "https://bnf.idm.oclc.org/login",
    AUTH_URL:
      "https://bnf.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U032999T_1",
  },
  {
    name: "Université Grenoble-Alpes",
    domains: ["grenet.fr"],
    LOGIN_URL: "https://sid2nomade-2.grenet.fr/login",
    AUTH_URL:
      "https://sid2nomade-2.grenet.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=grenobleT_1",
  },
  {
    name: "Université de Montpellier",
    domains: ["scdi-montpellier.fr"],
    LOGIN_URL: "https://ezpum.scdi-montpellier.fr/login",
    AUTH_URL:
      "https://ezpum.scdi-montpellier.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=MontpellierT_1",
  },
  {
    name: "Université Bordeaux Montaigne",
    domains: ["u-bordeaux-montaigne.fr"],
    LOGIN_URL: "https://www.ezproxy.u-bordeaux-montaigne.fr/login",
    AUTH_URL:
      "https://www.ezproxy.u-bordeaux-montaigne.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=UNIVMONTAIGNET_1",
  },
  {
    name: "Université de Bordeaux",
    domains: ["u-bordeaux.fr"],
    LOGIN_URL: "https://docelec.u-bordeaux.fr/login",
    AUTH_URL:
      "https://docelec.u-bordeaux.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=UNIVBORDEAUXT_1",
  },
  {
    name: "PSL",
    domains: ["psl.eu"],
    LOGIN_URL: "https://portail.psl.eu/login",
    AUTH_URL: "https://portail.psl.eu/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=PSLT_1"
  },
  {
    name: "Pas d'intermédiaire",
    domains: ["europresse.com"],
    LOGIN_URL: null,
    AUTH_URL: "https://nouveau.europresse.com/Login",
  }
];

/**
 * Get the config for a given domain
 * @param {string} domain
 */
function getOphirofoxConfigByDomain(domain) {
  return ophirofox_config_list.find(({ domains }) => domains.includes(domain));
}

/**
 * Get the config with the given name
 * @param {string} search_name
 */
function getOphirofoxConfigByName(search_name) {
  return ophirofox_config_list.find(({ name }) => search_name === name);
}

const DEFAULT_SETTINGS = {
  partner_name: "ULM",
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
  const domain = url.host.split(".").slice(-2).join(".");
  // Si la page actuelle est spécifique à une configuration, alors on l'utilise
  const domain_match = getOphirofoxConfigByDomain(domain);
  if (domain_match) return domain_match;
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
 * Crée un lien vers une recherche europresse pré-remplie avec les termes de recherche passés en argument
 * @param {string} keywords
 * @returns {URL}
 */
async function makeOphirofoxReadingLink(keywords) {
  const target_url = new URL("https://nouveau.europresse.com/Search/Reading");
  target_url.searchParams.set("ophirofox_source", window.location);
  target_url.searchParams.set("ophirofox_keywords", keywords);
  const config = await ophirofox_config;
  if (config.LOGIN_URL) {
    return new URL(`${config.LOGIN_URL}?url=${target_url}`);
  } else {
    return target_url;
  }
}

if (window.location.protocol.includes("extension")) {
  window.ophirofox_config_exports = {
    ophirofox_config_list,
    ophirofox_config,
    makeOphirofoxReadingLink,
    getSettings,
    setSettings,
  };
}
