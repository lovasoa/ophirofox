//Aknowledgment : arret-sur-images feature found already mostly done on https://github.com/Rohirrim03/ profile.
//BNF : Bibliothèque Nationale de France

/**
 * @description create link <a> to BNF mirror
 * @param {string} AUTH_URL_ARRETSURIMAGES
 */
async function createLink(AUTH_URL_ARRETSURIMAGES) {
    const span = document.createElement("span");
    span.textContent = "Lire avec BNF";
    span.className = "sub-stamp-component etiquette ophirofox-europresse";

    const a = document.createElement("a");
    var newUrl = new URL(window.location);//current page
    newUrl.host = AUTH_URL_ARRETSURIMAGES //change only the domain name
    newUrl.href
    a.href = newUrl;

    a.appendChild(span);

    return a;
}

/**
 * @description check DOM for article under paywall 
 * @return {HTMLElement} DOM Premium Banner and head of the article
*/
function findPremiumBanner() {
    const article = document.querySelector(".article");
    if (!article) return null;
    const elems = article.querySelectorAll("span, mark");
    const textToFind = ["réservé aux abonné.e.s", "Réservé à nos abonné.e.s"];

    return [...elems].filter(d => textToFind.some(text => d.textContent.includes(text)))        
}

/**@description check for BNF users. If yes, create link button */
async function onLoad() {

    const config = await configurationsSpecifiques(['BNF'])
    if(!config) return;
    const reserve = findPremiumBanner();
    if (!reserve) return;

    for (const balise of reserve) {
        balise.parentElement.appendChild(await createLink(config.AUTH_URL_ARRETSURIMAGES));
    }
}

setTimeout(function(){
    onLoad().catch(console.error);
}, 1000);