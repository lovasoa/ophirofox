function extractKeywords() {
    return extractKeywordsFromTitle() || extractKeywordsFromUrl(window.location);
}

function extractKeywordsFromTitle() {
    const titleElem = document.querySelector("h1");
    return titleElem && titleElem.textContent;
}

function extractKeywordsFromUrl(url) {
    const source_url = new URL(url);
    const le_progres_match = source_url.pathname.match(/([^/.]+)(_\d*_\d*\.html)?$/);
    if (!le_progres_match) throw new Error("Could not find keywords in le-progres url");
    return le_progres_match[1];
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    a.classList.add("btn", "bt_default");
    return a;
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function onLoad() {
    const actionElement = document.querySelector(".fullDetailActions");
    if (actionElement) {
        actionElement.appendChild(await createLink());
    }

    let paywallElem = await waitForElm(".p3-advanced-paywall");
    if (!paywallElem) return;

    const link = await createLink();
    link.className = "button";
    paywallElem.parentNode.insertBefore(link, paywallElem);
    
}

onLoad().catch(console.error);