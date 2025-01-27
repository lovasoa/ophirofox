async function createLink(AUTH_URL) {
    const div = document.createElement("div");
    div.className = "ophirofox-europresse"
    const a = document.createElement("a");
    a.textContent = "Cliquez pour lire avec BNF"
    var newUrl = new URL(window.location);//current page
    newUrl.host = AUTH_URL //change only the domain name
    a.href = newUrl;

    div.appendChild(a);
    return div;
}

/**
 * @description website navigation without window reload.
 */
async function onLoad() {
    const config = await configurationsSpecifiques(['BNF'])
    if(!config) return;
    //too much js dom updates everywere to choose a more specific DOM.element.
    const element = document.querySelector('body');
    if (!element) return;
    element.insertAdjacentElement('beforeend', await createLink(config.AUTH_URL_PRESSREADER));
}

onLoad().catch(console.error)