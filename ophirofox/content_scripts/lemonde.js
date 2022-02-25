async function makeEuropresseUrl(lemondeUrl) {
    const m = lemondeUrl.pathname.match(/(\d{4})\/(\d{2})\/(\d{2})\/.*?(\d+_\d+).html/);
    if (!m) throw new Error("Format d'URL lemonde inconnu");
    // docKey : `news·${m[1]}${m[2]}${m[3]}·LMF·${m[4]}`);
    const keywords = extractKeywords();
    return await makeOphirofoxReadingLink(keywords);
}

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
    const a = document.createElement("a");
    a.textContent = "Lire sur Europresse";
    a.className = "btn btn--premium ophirofox-europresse";
    a.href = await makeEuropresseUrl(new URL(window.location));
    return a;
}

async function onLoad() {
    //remove pay banner
    document.getElementById('js-message-register').remove();
    
    const statusElem = document.querySelector(".article__status");
    if (!statusElem) return;
    statusElem.appendChild(await createLink());
}

onLoad().catch(console.error);