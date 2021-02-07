async function makeEuropresseUrl() {
    const keywords = extractKeywordsFromUrl(window.location);
    return await makeOphirofoxReadingLink(keywords);
}

function extractKeywordsFromUrl(url) {
    const source_url = new URL(url);
    const keywords_in_url = source_url.pathname.match(/([^/.]+)_\d*$/);
    if (!keywords_in_url) throw new Error("Could not find keywords in url");
    return keywords_in_url[1];
}

async function createLink() {
    const a = document.createElement("a");
    a.href = await makeEuropresseUrl(new URL(window.location));
    a.textContent = "Lire sur Europresse";
    a.className = "ribbon-premium ophirofox-europresse";
    return a;
}

async function onLoad() {
    const statusElem = document.querySelector(".article-header .ribbon-premium");
    if (!statusElem) return;
    statusElem.after(await createLink());
}

onLoad();
