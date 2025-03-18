const choicelist = document.getElementById("partner_choices");
const template = document.getElementById("partner_template");
const search = document.getElementById("partner_search");
const missing_permissions_btn = document.getElementById("missing_permissions");
const openLinksCheckbox = document.getElementById("open_links_new_tab");
const showPageActionCheckbox = document.getElementById("show_page_action");
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
  showPageActionCheckbox.checked = settings.show_page_action !== false;
});

// Gestion des modifications de la case à cocher pour les liens
openLinksCheckbox.onchange = () => {
  settings.open_links_new_tab = openLinksCheckbox.checked;
  setSettings(settings);
};

// Gestion des modifications de la case à cocher pour l'icône
showPageActionCheckbox.onchange = () => {
  settings.show_page_action = showPageActionCheckbox.checked;
  setSettings(settings);
  chrome.runtime.sendMessage({
    action: "updatePageAction",
    show: showPageActionCheckbox.checked
  });
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

// Modifie le texte affichée pour la case à cocher en fonction du navigateur
// selon le navigateur, car c'est implémenté différemment dans Firefox et Chrome.
document.addEventListener("DOMContentLoaded", function () {
  const label = document.querySelector('label[for="show_page_action"]');
  const browserType = getBrowserType();
  console.log("TYPE : " + browserType);
  if (label) {
    let message;
    if (browserType == "firefox") {
      message = "Afficher un icône dans la barre d'adresse quand un article premium est détecté";
    } else {
      message = "Cliquer sur l'icône dans la barre d'adresse ouvre l'article premium dans Europresse";
    }
    label.innerHTML = `<input type="checkbox" id="show_page_action"> ${message}`;
  }
});

window.onload = function () {
  const label = document.querySelector('label[id="show_page_action_label"]');
  const browserType = getBrowserType();
  if (label) {
    let message;
    if (browserType == "firefox") {
      message = "Afficher un icône dans la barre d'adresse quand un article premium est détecté";
    } else {
      message = "Cliquer sur l'icône de l'extension ouvre l'article premium sur Europresse";
    }
    label.innerHTML = `<input type="checkbox" id="show_page_action"> ${message}`;
  }
};

function getBrowserType() {
  if (typeof browser !== "undefined") {
    return "firefox";
  } else if (typeof chrome !== "undefined") {
    return "chrome";
  } else {
    return "unknown";
  }
}