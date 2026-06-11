//Aknowledgment : arret sur images feature found already mostly done on https://github.com/Rohirrim03/ profile.
//BNF : Bibliothèque Nationale de France

const BNF_ARRETSURIMAGES_LOGIN_URL = "https://bnf.idm.oclc.org/login?url=http://www.arretsurimages.net/autologin.php";

function isConnected() {
    return !!localStorage.getItem("auth_access_token");
}

/**
 * @description create link <a> to BNF mirror
 * @param {string} AUTH_URL_ARRETSURIMAGES
 */
function createLink() {
    const span = document.createElement("span");
    span.textContent = "Lire avec BNF";
    span.className = "sub-stamp-component etiquette ophirofox-europresse";
    const a = document.createElement("a");
    a.href = BNF_ARRETSURIMAGES_LOGIN_URL;
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
    return [...elems].filter(d => textToFind.some(text => d.textContent.includes(text)));
}

async function handleArretSurImagesMirror() {
    const checkAndRedirect = async () => {
        const currentPage = new URL(window.location);
        console.log("[ophirofox][asi-mirror] checkAndRedirect START", currentPage.pathname);

        if (currentPage.pathname === "/autologin.php") {
            console.log("[ophirofox][asi-mirror] sur autologin.php, on attend la redirect");
            return;
        }

        const { ophirofox_arretsurimages_article: articlePath, ophirofox_asi_login_ts: loginTs } =
            await chrome.storage.sync.get(['ophirofox_arretsurimages_article', 'ophirofox_asi_login_ts']);

        const connected = isConnected();
        console.log("[ophirofox][asi-mirror] connected:", connected, "| pathname:", currentPage.pathname);

        if (currentPage.pathname.startsWith("/articles/")) {
            if (!connected) {
                if (loginTs && Date.now() - loginTs < 30000) {
                    console.log("[ophirofox][asi-mirror] login récent mais toujours pas connecté, abandon");
                    chrome.storage.sync.remove(["ophirofox_arretsurimages_article", "ophirofox_asi_login_ts"]);
                    return;
                }
                console.log("[ophirofox][asi-mirror] non connecté, lancement du flow login");
                await chrome.storage.sync.set({
                    "ophirofox_arretsurimages_article": currentPage.pathname,
                    "ophirofox_asi_login_ts": Date.now()
                });
                window.location.href = BNF_ARRETSURIMAGES_LOGIN_URL;
            } else {
                chrome.storage.sync.remove(["ophirofox_arretsurimages_article", "ophirofox_asi_login_ts"]);
            }
            return;
        }

        if (!articlePath) return;

        if (connected) {
            console.log("[ophirofox][asi-mirror] connecté, redirect vers:", articlePath);
            chrome.storage.sync.remove(["ophirofox_arretsurimages_article", "ophirofox_asi_login_ts"]);
            window.location.pathname = articlePath;
        } else {
            console.log("[ophirofox][asi-mirror] pas connecté malgré le flow, abandon");
            chrome.storage.sync.remove(["ophirofox_arretsurimages_article", "ophirofox_asi_login_ts"]);
        }
    };

    await checkAndRedirect();

    // Hook pushState + replaceState
    for (const method of ["pushState", "replaceState"]) {
        const orig = history[method].bind(history);
        history[method] = (...args) => { orig(...args); checkAndRedirect(); };
    }
    window.addEventListener("popstate", checkAndRedirect);

    // Filet de sécurité : polling sur l'URL pour les SPA qui ne passent pas par history API
    let lastPathname = window.location.pathname;
    setInterval(() => {
        if (window.location.pathname !== lastPathname) {
            lastPathname = window.location.pathname;
            console.log("[ophirofox][asi-mirror] URL change détecté via polling:", lastPathname);
            checkAndRedirect();
        }
    }, 500);
}

async function handleArretSurImages(config) {
    console.log("[ophirofox][asi] checking for premium banner");
    const reserve = findPremiumBanner();
    if (!reserve?.length) {
        console.log("[ophirofox][asi] no premium banner found, aborting");
        return;
    }
    console.log("[ophirofox][asi] premium banner found, setting storage and injecting link");
    chrome.storage.sync.set({
        "ophirofox_arretsurimages_article": new URL(window.location).pathname
    });
    for (const balise of reserve) {
        balise.parentElement.appendChild(createLink());
    }
}

/**@description check for BNF users. If yes, create link button */
async function onLoad() {
    console.log("[ophirofox][asi] onLoad");
    const config = await configurationsSpecifiques(['BNF']);
    if (!config) {
        console.log("[ophirofox][asi] no BNF config found, aborting");
        return;
    }
    const currentPage = new URL(window.location);
    console.log("[ophirofox][asi] currentPage.host:", currentPage.host, "| AUTH_URL_ARRETSURIMAGES:", config.AUTH_URL_ARRETSURIMAGES);
    if (currentPage.host == config.AUTH_URL_ARRETSURIMAGES) {
        console.log("[ophirofox][asi] on mirror, running handleArretSurImagesMirror");
        handleArretSurImagesMirror();
    } else {
        console.log("[ophirofox][asi] on original site, running handleArretSurImages");
        setTimeout(() => handleArretSurImages(config).catch(console.error), 1000);
    }
}

onLoad().catch(console.error);