
/**
 * @description create link <a> to BNF mirror
 * @param {string} AUTH_URL_MEDIAPART
 */
async function createLink(AUTH_URL_MEDIAPART) {
    const span = document.createElement("span");
    span.textContent = "Lire avec BNF";

    const a = document.createElement("a");
    a.href = new URL(window.location);
    a.host = AUTH_URL_MEDIAPART
    a.appendChild(span);

    return a;
}

/**
 * @description check DOM for article under paywall 
 * @return {HTMLElement} DOM Premium Banner and head of the article
*/
function findPremiumBanner() {
    const article = document.querySelector(".news__body__center__container");
    if (!article) return null;
    const elems = article.querySelectorAll(".paywall-message");
    console.log("elements",elems)
    //labels not the same for mobile or PC display
    const textToFind = ["réservée aux abonné·es", "réservé aux abonné·es"]

    return [...elems].filter((balise) =>  textToFind.some((text) => balise.textContent.toLowerCase().includes(text))  )
    
}

/**@description check for BNF users. If yes, create link button */
async function onLoad() {

    const config = await configurationsSpecifiques(['BNF'])
    if(!config) return;
    var newUrl = new URL(window.location);//current page
    if (newUrl.host+'/' == 'www-mediapart-fr.bnf.idm.oclc.org/' ) {
        const domNavigation = document.querySelector('ul.nav__actions')
        const spans = domNavigation.querySelectorAll('span')
        //search account name
    let isFound =   Array.from(spans).find((elem) => elem.textContent == 'Bibliothèque Nationale de France')
        if(!isFound){
            console.log('is not found')
            //account name not found. fetch login page
            fetch("https://www-mediapart-fr.bnf.idm.oclc.org/licence").then(() => window.location.reload());
        }
    }else{
        const reserve = findPremiumBanner();
        if (!reserve) return;

        for (const balise of reserve) {
        balise.appendChild(await createLink(config.AUTH_URL_MEDIAPART))
        }
    }
}

onLoad().catch(console.error);