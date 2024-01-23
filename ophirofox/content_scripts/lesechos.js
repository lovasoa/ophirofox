function extractKeywords() {
    return extractKeywordsFromTitle() || extractKeywordsFromUrl(window.location);
}

function extractKeywordsFromTitle() {
    const titleElem = document.querySelector("h1").childNodes[0];
    return titleElem && titleElem.textContent;
}

function extractKeywordsFromUrl(url) {
    /*const source_url = new URL(url);
    const lemonde_match = source_url.pathname.match(/([^/.]+)(_\d*_\d*\.html)?$/);
    if (!lemonde_match) throw new Error("Could not find keywords in lemonde url");
    return lemonde_match[1];*/
    throw new Error("not implemented");
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    a.classList.add("btn", "btn--premium");
    return a;
}

async function onLoad() {
    /* Weird reloading after load */
    await new Promise(r => setTimeout(r, 1000));
    const article = document.querySelectorAll("article")[0];
    const elt = article.children[1].children[1].children[0].children[0].children[1].children[0]
    if (elt) {
        elt.appendChild(await createLink());
    }
}

onLoad().catch(console.error);
