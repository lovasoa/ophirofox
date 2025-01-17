//Aknowledgment : arret-sur-images feature found already mostly done on https://github.com/Rohirrim03/ profile.
//BNF : Bibliothèque Nationale de France

/**@description create link to BNF mirror */
async function createLink() {
    const span = document.createElement("span");
    span.textContent = "Lire avec BNF";
    span.className = "sub-stamp-component etiquette ophirofox-europresse";

    const a = document.createElement("a");
    var newUrl = new URL(window.location);
    newUrl.host = "www-arretsurimages-net.bnf.idm.oclc.org";
    a.href = newUrl;

    a.appendChild(span);

    return a;
}

/**
 * @description check DOM for article under paywall 
 * @return {HTMLElement} DOM Premium Banner
*/
function findPremiumBanner() {
    const articleContainer = document.querySelector(".article-content");
    //check if page is a article
    if (!articleContainer) return null;
    const paywall = document.querySelector(".paywall-block");
    const elems = paywall.querySelectorAll("mark");
    
    return [...elems].find(d => d.textContent.includes("réservé aux abonné.e.s"))
}

/**@description check for BNF users. If yes, create link button */
async function onLoad() {
    const config = await ophirofox_config;
    if(config.name !== 'BNF') return;
    
    const reserve = findPremiumBanner();
    if (!reserve) return;

    reserve.parentElement.appendChild(await createLink());
}

setTimeout(function(){
    onLoad().catch(console.error);
}, 1000);