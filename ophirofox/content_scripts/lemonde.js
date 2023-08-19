function extractKeywords() {
    return extractKeywordsFromTitle() || extractKeywordsFromUrl(window.location);
}

function extractKeywordsFromTitle() {
    const titleElem = document.querySelector("h1.article__title");
    return titleElem && titleElem.textContent;
}

function extractKeywordsFromUrl(url) {
    const source_url = new URL(url);
    const lemonde_match = source_url.pathname.match(/([^/.]+)(_\d*_\d*\.html)?$/);
    if (!lemonde_match) throw new Error("Could not find keywords in lemonde url");
    return lemonde_match[1];
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    a.classList.add("btn", "btn--premium");
    return a;
}

async function onLoad() {
    const statusElem = document.querySelector(".article__status");
    if (statusElem) {
        statusElem.appendChild(await createLink());
    }
    const paywallElem = document.querySelector(".paywall-04__cta");
    if (paywallElem) {
        const link = await createLink();
        link.className = "lmd-btn lmd-btn--l lmd-btn--premium paywall-04__cta";
        paywallElem.parentNode.insertBefore(link, paywallElem);
    }
}

onLoad().catch(console.error);