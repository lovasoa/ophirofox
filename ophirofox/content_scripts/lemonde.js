function makeEuropresseUrl(lemondeUrl) {
    const m = lemondeUrl.pathname.match(/(\d{4})\/(\d{2})\/(\d{2})\/.*?(\d+_\d+).html/);
    if (!m) throw new Error("Format d'URL lemonde inconnu");
    const target_url = new URL("https://nouveau.europresse.com/Search/Reading");
    //target_url.searchParams.set("docKey", `news·${m[1]}${m[2]}${m[3]}·LMF·${m[4]}`);
    target_url.searchParams.set("ophirofox_source", window.location);
    target_url.searchParams.set("ophirofox_keywords", extractKeywords());
    //target_url.hash = "docText";
    const url = new URL("http://proxy.rubens.ens.fr/login?url=" + target_url);
    return url;
}

function extractKeywords() {
    const stopwords = new Set(['d', 'l', 'et'])
    const keywords = extractKeywordsFromTitle() || extractKeywordsFromUrl(window.location);
    return keywords.filter(w => !stopwords.has(w)).join(' ');
}

function extractKeywordsFromTitle() {
    const titleElem = document.querySelector("h1.article__title");
    return titleElem && titleElem.textContent.split(/[^\w]+/);
}

function extractKeywordsFromUrl(url) {
    const source_url = new URL(url);
    const lemonde_match = source_url.pathname.match(/([^/.]+)(_\d*_\d*\.html)?$/);
    if (!lemonde_match) throw new Error("Could not find keywords in lemonde url");
    return lemonde_match[1].split('-');
}

function createLink() {
    const a = document.createElement("a");
    a.href = makeEuropresseUrl(new URL(window.location));
    a.textContent = "Lire sur Europresse";
    a.className = "btn btn--premium ophirofox-europresse";
    return a;
}

function onLoad() {
    const statusElem = document.querySelector(".article__status");
    if (!statusElem) return;
    statusElem.appendChild(createLink());
}

onLoad();