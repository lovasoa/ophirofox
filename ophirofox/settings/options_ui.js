const choicelist = document.getElementById("partner_choices");
const template = document.getElementById("partner_template");
const search = document.getElementById("partner_search");
const missing_permissions_btn = document.getElementById("missing_permissions");
const openLinksCheckbox = document.getElementById("open_links_new_tab");
const autoOpenLinkCheckbox = document.getElementById("auto_open_link");

let settings = {};

// Fonction pour ajouter un partenaire à la liste
function add_partner(name) {
  const clone = template.content.cloneNode(true);
  const span = clone.getElementById("partner_name");
  /** @type {HTMLInputElement} */
  const input = clone.querySelector("input");
  span.textContent = name;
  choicelist.appendChild(clone);
  input.checked = settings.partner_name === name;
  input.onchange = async () => {
    if (input.checked) {
      try {
        await ophirofoxAskPermissions(name);
        settings.partner_name = name;
        await setSettings(settings);
        reCheckPermissions(name);
      } catch (err) {
        console.error(err);
        input.checked = false;
      }
    }
  };
}

// Fonction pour vérifier les permissions
async function reCheckPermissions(name) {
  missing_permissions_btn.hidden = await ophirofoxCheckPermissions(name);
}

// Récupération des paramètres et initialisation de l'interface
getSettings().then((retrievedSettings) => {
  settings = retrievedSettings;
  ophirofox_config_list.forEach(p => add_partner(p.name));
  reCheckPermissions(settings.partner_name);
  openLinksCheckbox.checked = settings.open_links_new_tab || false;
  autoOpenLinkCheckbox.checked = settings.auto_open_link || false;
});

// Gestion des modifications de la case à cocher
openLinksCheckbox.onchange = () => {
  settings.open_links_new_tab = openLinksCheckbox.checked;
  setSettings(settings);
};

autoOpenLinkCheckbox.onchange = () => {
  settings.auto_open_link = autoOpenLinkCheckbox.checked;
  setSettings(settings);
};

// Gestion du bouton de permissions manquantes
missing_permissions_btn.onclick = async () => {
  const partner_name = settings.partner_name;
  await ophirofoxAskPermissions(partner_name);
  missing_permissions_btn.hidden = true;
};

// Gestion de la recherche de partenaires
search.oninput = () => {
  const search_term = search.value.toLowerCase();
  const partners = choicelist.getElementsByClassName("partner");
  Array.from(partners).forEach((partner) => {
    const partner_name = partner.textContent.toLowerCase();
    partner.hidden = !partner_name.includes(search_term);
  });
};
