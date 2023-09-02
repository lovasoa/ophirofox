const choicelist = document.getElementById("partner_choices");
const template = document.getElementById("partner_template");
const settings_promise = getSettings();

ophirofox_config_list.forEach(({ name }) => {
  const clone = template.content.cloneNode(true);
  const span = clone.getElementById("partner_name");
  /** @type {HTMLInputElement} */
  const input = clone.querySelector("input");
  span.textContent = name;
  choicelist.appendChild(clone);
  settings_promise.then((settings) => {
    input.checked = settings.partner_name === name;
    input.onchange = async () => {
      if (input.checked) {
        try {
          await ophirofoxCheckPermissions(name); 
          setSettings({ ...settings, partner_name: name });
        } catch (err) {
          console.error(err);
          // restore previous value
          input.checked = false;
        }
      }
    };
  });
});