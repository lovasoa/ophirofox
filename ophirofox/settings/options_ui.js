const choicelist = document.getElementById("partner_choices");
const template = document.getElementById("partner_template");
const search = document.getElementById("partner_search");
const missing_permissions_btn = document.getElementById("missing_permissions");
const openLinksCheckbox = document.getElementById("open_links_new_tab");
const autoOpenLinkCheckbox = document.getElementById("auto_open_link");
const addSearchMenuCheckbox = document.getElementById("add_search_menu");

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
  addSearchMenuCheckbox.checked = settings.add_search_menu || false;
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

addSearchMenuCheckbox.onchange = async () => {
  settings.add_search_menu = addSearchMenuCheckbox.checked;
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

/*
const permissionsToRequest = {
  permissions: ["menus", "contextMenus","activeTab","storage","scripting","webRequest"],
  origins: ["https://github.com/lovasoa/ophirofox"],
};

async function requestMenuPermission() {
  alert('contextMenus');
  function onResponse(response) {
    if (response) {
      alert("Permission was granted");
    } else {
      alert("Permission was refused");
    }
    return browser.permissions.getAll();
  }

  const response = await browser.permissions.request(permissionsToRequest);
  const currentPermissions = await onResponse(response);

  console.log(`Current permissions:`, currentPermissions);
}

document
    .querySelector("#request")
    .addEventListener("click", requestPermissions);


/*
function requestMenuPermission() {
  alert('contextMenus');
  browser.permissions.request({ permissions: ['menus'] }).then((granted) => {
    if (granted) {
      setupContextMenu();
      alert("setupContextMenu");
    } else {
      alert("La permission a été refusée.");
    }
  });
}

function setupContextMenu() {
  browser.contextMenus.create({
    id: "EuropresseSearchMenu",
    title: "Rechercher sur Europresse",
    contexts: ["selection"]
  });

  function onCreated() {
    if (browser.runtime.lastError) {
      console.log(`Error: ${browser.runtime.lastError}`);
    } else {
      console.log("EuropresseSearchMenu created successfully");
    }
  }

  browser.contextMenus.onClicked.addListener( async (info, tab) => {
    switch (info.menuItemId) {
      case "EuropresseSearchMenu":
        console.log("EuropresseSearchMenu",info.selectionText);
        const search_request = info.selectionText;
        await chrome.storage.local.set({"EuropresseSearchMenu_request": search_request});
        browser.tabs.create({
          url: "https://bnf.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=D000067U_1"
        });
        break;
    }
  });
}

// Appeler cette fonction en réponse à une action utilisateur, par exemple un clic sur un bouton
document.getElementById('enable-context-menu').addEventListener('click', requestMenuPermission);
*/