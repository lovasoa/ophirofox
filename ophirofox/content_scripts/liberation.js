function makeEuropresseUrl(lemondeUrl) {
    const target_url = new URL("https://nouveau.europresse.com/Search/Reading");
    target_url.searchParams.set("ophirofox_source", window.location);
    target_url.searchParams.set("ophirofox_keywords", extractKeywords(window.location));
    const url = new URL("http://proxy.rubens.ens.fr/login?url=" + target_url);
    return url;
}

function extractKeywords(url) {
    const source_url = new URL(url);
    const keywords_in_url = source_url.pathname.match(/([^/.]+)_\d*$/);
    if (!keywords_in_url) throw new Error("Could not find keywords in url");
    const stopwords = new Set(['d', 'l', 'et'])
    const search_terms = keywords_in_url[1].split('-').filter(w => !stopwords.has(w));
    return search_terms.join(" ");
}

function createLink() {
    const a = document.createElement("a");
    a.href = makeEuropresseUrl(new URL(window.location));
    a.textContent = "Lire sur Europresse";
    a.className = "ribbon-premium ophirofox-europresse";
    return a;
}

function onLoad() {
    const statusElem = document.querySelector(".article-header .ribbon-premium");
    if (!statusElem) return;
    statusElem.after(createLink());
}

onLoad();