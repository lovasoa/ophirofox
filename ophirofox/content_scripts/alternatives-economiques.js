//BNF : Bibliothèque Nationale de France

const BNF_ALTERNATIVESECONOMIQUES_LOGIN_URL = "https://bnf.idm.oclc.org/login?url=https://www.alternatives-economiques.fr";

/**
 * @description create link <a> to BNF mirror
 */
function createLink() {
    const a = document.createElement("a");
    a.textContent = "Lire avec BNF";
    a.href = BNF_ALTERNATIVESECONOMIQUES_LOGIN_URL;
    return a;
}

/**
 * @description check DOM for paywall iframe
 */
function findPremiumBanner() {
    const paywall = document.querySelector("iframe#p3-paywall");
    if (!paywall) return [];
    return [paywall];
}

async function handleAlternativesEconomiquesMirror(config) {
    const currentPage = new URL(window.location);
    console.log("[ophirofox][ae-mirror] on mirror:", currentPage.pathname);

    const { ophirofox_alternativeseconomiques_article: articlePath } =
        await chrome.storage.sync.get(['ophirofox_alternativeseconomiques_article']);

    if (!articlePath) {
        return;
    }

    console.log("[ophirofox][ae-mirror] redirect to:", articlePath);
    chrome.storage.sync.remove(["ophirofox_alternativeseconomiques_article"]);
    window.location.pathname = articlePath;
}

async function handleAlternativesEconomiques(config) {
    console.log("[ophirofox][ae] checking for premium banner");

    const reserve = findPremiumBanner();
    if (!reserve?.length) return;

    console.log("[ophirofox][ae] premium banner found, storing article path");
    chrome.storage.sync.set({
        "ophirofox_alternativeseconomiques_article": new URL(window.location).pathname
    });

    injectRubriquesBnfLink();
}

/** @description watch for the paywall iframe to appear */
function watchForPaywall(config) {
    handleAlternativesEconomiques(config).catch(console.error);

    const observer = new MutationObserver(() => {
        if (document.querySelector("iframe#p3-paywall")) {
            console.log("[ophirofox][ae] paywall iframe detected via observer");
            handleAlternativesEconomiques(config).catch(console.error);
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => observer.disconnect(), 30000);
}

/** @description inject BNF link as first child inside .article-header__rubriques */
async function injectRubriquesBnfLink() {
    const tryInject = () => {
        const rubriques = document.querySelector(".article-header__rubriques");
        if (!rubriques) return false;
        if (rubriques.querySelector(".ophirofox-europresse")) return true;
        const link = createLink();
        link.className = "ophirofox-europresse";
        rubriques.insertBefore(link, rubriques.firstChild);
        return true;
    };

    if (tryInject()) return;

    const observer = new MutationObserver(() => {
        if (tryInject()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 30000);
}

async function onLoad() {
    console.log("[ophirofox][ae] onLoad");

    const config = await configurationsSpecifiques(['BNF']);
    if (!config) {
        console.log("[ophirofox][ae] no BNF config found, aborting");
        return;
    }
    const currentPage = new URL(window.location);
    if (currentPage.host == config.AUTH_URL_ALTERNATIVESECONOMIQUES) {
        console.log("[ophirofox][ae] on mirror, running handleAlternativesEconomiquesMirror");
        handleAlternativesEconomiquesMirror(config);
    } else {
        watchForPaywall(config);
    }
}

onLoad().catch(console.error);
