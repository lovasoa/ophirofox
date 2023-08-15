async function consumeSearchTerms() {
    return new Promise((accept, reject) => {
        chrome.storage.local.get("ophirofox_keywords",
            (r) => {
                accept(r.ophirofox_keywords);
                chrome.storage.local.remove("ophirofox_keywords");
            });
    })
}

async function onLoad() {
    if (!window.location.pathname.startsWith("/Search/Reading")) return;
    const search_terms = await consumeSearchTerms();
    if (!search_terms) return;
    const stopwords = new Set(['d', 'l', 'et']);
    const keywords = search_terms
        .replace(/œ/g, 'oe')
        .split(/[^\p{L}]+/u)
        .filter(w => !stopwords.has(w))
        .join(' ');
    const keyword_field = document.getElementById("Keywords");
    keyword_field.value = 'TIT_HEAD=' + keywords;
    keyword_field.form.submit();
}

onLoad();