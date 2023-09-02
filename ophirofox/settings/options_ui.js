const choicelist = document.getElementById("partner_choices");
const template = document.getElementById("partner_template");
const search = document.getElementById("partner_search");
const missing_permissions_btn = document.getElementById("missing_permissions");

const settings_promise = getSettings();

function add_partner(name, settings) {
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
        setSettings({ ...settings, partner_name: name });
        reCheckPermissions(name);
      } catch (err) {
        console.error(err);
        // restore previous value
        input.checked = false;
      }
    }
  };
}

async function reCheckPermissions(name) {
  missing_permissions_btn.hidden = await ophirofoxCheckPermissions(name);
}

settings_promise.then((settings) => {
  ophirofox_config_list.forEach(p => add_partner(p.name, settings));
  reCheckPermissions(settings.partner_name);
});

missing_permissions_btn.onclick = async () => {
  const partner_name = current_settings.partner_name;
  await ophirofoxAskPermissions(partner_name);
  missing_permissions_btn.hidden = true;
}

search.oninput = () => {
  const search_term = search.value;
  const partners = choicelist.getElementsByClassName("partner");
  Array.from(partners).forEach((partner) => {
    const partner_name = partner.textContent;
    partner.hidden = !partner_name.toLowerCase().includes(search_term.toLowerCase());
  });
}