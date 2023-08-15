const ophirofox_config_list = `
Pas d'intermédiaire,https://nouveau.europresse.com/Login
BNF,https://bnf.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U032999T_1
ENS de Lyon,https://acces.bibliotheque-diderot.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=ENSLYONT_1
ENSAM,https://rp1.ensam.eu/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=AML
INSA Lyon,https://docelec.insa-lyon.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=INSAT_3
ULM,https://proxy.rubens.ens.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=PSLT_1
Université Bordeaux Montaigne,https://www.ezproxy.u-bordeaux-montaigne.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=UNIVMONTAIGNET_1
Université Grenoble-Alpes,https://sid2nomade-2.grenet.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=grenobleT_1
Université Paris 1 Panthéon-Sorbonne,https://ezpaarse.univ-paris1.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=SORBONNET_1
Université Paris Cité,https://ezproxy.u-paris.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=UNIVPARIS
Université Paris-Saclay,https://ezproxy.universite-paris-saclay.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=U031535T_9
Université d'Artois,http://ezproxy.univ-artois.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=littoralT_1
Université de Bordeaux,https://docelec.u-bordeaux.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=UNIVBORDEAUXT_1
Université de Franche-Comté,http://scd1.univ-fcomte.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=FCOMTET_1
Université de Haute-Alsace,https://scd-proxy.uha.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=ALSACET_1
Université de Montpellier,https://ezpum.scdi-montpellier.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=MontpellierT_1
Université de Pau et des Pays de l'Adour,https://rproxy.univ-pau.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=uppaT_2
`.split('\n')
  .filter(line => line.trim().length > 0)
  .map(line => {
    const [name, AUTH_URL] = line.split(',');
    return { name, AUTH_URL };
  });

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
  a.onclick = function (evt) {
    evt.preventDefault();
    chrome.storage.local.set({ "ophirofox_keywords": keywords }, () => {
      ophirofox_config.then(({ AUTH_URL }) => window.location = AUTH_URL);
    });
  }
  ophirofox_config.then(({ AUTH_URL }) => { a.href = AUTH_URL });
  return a;
}
