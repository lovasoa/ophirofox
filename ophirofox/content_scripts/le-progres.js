function extractKeywords() {
    // Works better with keywords from url
    return extractKeywordsFromUrl(window.location) || extractKeywordsFromTitle();
}

function extractKeywordsFromTitle() {
    const titleElem = document.querySelector("head > title, article h1");
    return titleElem && titleElem.textContent;
}

function extractKeywordsFromUrl(url) {
    const source_url = new URL(url);
    const le_progres_match = source_url.pathname.match(/([^/.]+)(_\d*_\d*\.html)?$/);
    if (!le_progres_match) return false;
    return le_progres_match[1];
}

function extractPublishDate() {
    try {
        const script = document.querySelector("script[type='application/ld+json']")
        const json = JSON.parse(script.innerText)
        const datePublished = json[0].datePublished;
        return datePublished;
    } catch {
        // tant pis
        return null;
    }
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords(), { publishedTime: extractPublishDate() });
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
