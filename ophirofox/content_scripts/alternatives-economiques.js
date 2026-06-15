//BNF : Bibliothèque Nationale de France

const BNF_ALTERNATIVESECONOMIQUES_LOGIN_URL = "https://bnf.idm.oclc.org/login?url=https://www.alternatives-economiques.fr";

/**
 * @description create link <a> to BNF mirror
 */
function createLink() {
    const span = document.createElement("span");
    span.textContent = "Lire avec BNF";
    span.className = "sub-stamp-component etiquette ophirofox-europresse";
    const a = document.createElement("a");
    a.href = BNF_ALTERNATIVESECONOMIQUES_LOGIN_URL;
    a.appendChild(span);
    return a;
}

/**
 * @description check DOM for paywall iframe
 * @return {HTMLElement[]} The paywall iframe elements
 */
function findPremiumBanner() {
    const paywall = document.querySelector("iframe#temp-paywall");
    if (!paywall) return [];
    return [paywall];
}

/** @return {boolean} true si le bouton BNF est déjà dans le DOM */
function bnfLinkAlreadyPresent() {
    return !!document.querySelector("a.ophirofox-europresse");
}

async function handleAlternativesEconomiquesMirror(config) {
    const currentPage = new URL(window.location);
    console.log("[ophirofox][ae-mirror] on mirror:", currentPage.pathname);

    const { ophirofox_alternativeseconomiques_article: articlePath } =
        await chrome.storage.sync.get(['ophirofox_alternativeseconomiques_article']);

    if (!articlePath) {
        // If we're directly on the mirror with no stored article, nothing to do
        return;
    }

    // Redirect to the stored article on the mirror
    console.log("[ophirofox][ae-mirror] redirect to:", articlePath);
    chrome.storage.sync.remove(["ophirofox_alternativeseconomiques_article"]);
    window.location.pathname = articlePath;
}

async function handleAlternativesEconomiques(config) {
    console.log("[ophirofox][ae] checking for premium banner");

    if (bnfLinkAlreadyPresent()) return;

    const reserve = findPremiumBanner();
    if (!reserve?.length) return;

    console.log("[ophirofox][ae] premium banner found, injecting link");
    chrome.storage.sync.set({
        "ophirofox_alternativeseconomiques_article": new URL(window.location).pathname
    });

    for (const balise of reserve) {
        const link = createLink();
        balise.parentElement.insertBefore(link, balise);
        console.log("[ophirofox][ae] link injected —", link);
        console.log("[ophirofox][ae] find it with: document.querySelector('a.ophirofox-europresse')");
    }
}

/** @description watch for the paywall iframe to appear and inject the BNF link */
function watchForPaywall(config) {
    // Tentative immédiate au cas où l'iframe est déjà là
    handleAlternativesEconomiques(config).catch(console.error);

    // Observe le DOM jusqu'à ce que iframe#temp-paywall apparaisse
    const observer = new MutationObserver(() => {
        if (document.querySelector("iframe#temp-paywall")) {
            console.log("[ophirofox][ae] paywall iframe detected via observer");
            handleAlternativesEconomiques(config).catch(console.error);
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Filet de sécurité : arrêter l'observer après 30s
    setTimeout(() => observer.disconnect(), 30000);
}

/** @description check for BNF users. If yes, create link button */
async function onLoad() {
    console.log("[ophirofox][ae] onLoad");
    const config = await configurationsSpecifiques(['BNF']);
    if (!config) {
        console.log("[ophirofox][ae] no BNF config found, aborting");
        return;
    }
    const currentPage = new URL(window.location);
    console.log("[ophirofox][ae] currentPage.host:", currentPage.host, "| AUTH_URL_ALTERNATIVESECONOMIQUES:", config.AUTH_URL_ALTERNATIVESECONOMIQUES);
    if (currentPage.host == config.AUTH_URL_ALTERNATIVESECONOMIQUES) {
        console.log("[ophirofox][ae] on mirror, running handleAlternativesEconomiquesMirror");
        handleAlternativesEconomiquesMirror(config);
    } else {
        console.log("[ophirofox][ae] on original site, running handleAlternativesEconomiques");
        watchForPaywall(config);
    }
}

onLoad().catch(console.error);
