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
    ophirofoxRealoadOnExpired();
    const path = window.location.pathname;
    if (!(
        path.startsWith("/Search/Reading") ||
        path.startsWith("/Search/Advanced") ||
        path.startsWith("/Search/AdvancedMobile") ||
        path.startsWith("/Search/Express") ||
        path.startsWith("/Search/Simple")
    )) return;
    const search_terms = await consumeSearchTerms();
    if (!search_terms) return;
    const stopwords = new Set(['d', 'l', 'et', 'sans']);

    /*
        L = { Lu , Ll , Lt , Lm , Lo }
        M = { Mn , Mc , Me }
        Nd: a decimal digit
        Unicode specification: https://www.unicode.org/reports/tr44/#General_Category_Values
        Categories browser: https://www.compart.com/fr/unicode/category
    */
    const keywords = search_terms
        .replace(/œ/g, 'oe')
        .split(/[^\p{L}\p{M}\p{Nd}]+/u)
        .filter(w => !stopwords.has(w))
        .join(' ');
    const keyword_field = document.getElementById("Keywords");
    keyword_field.value = 'TIT_HEAD=' + keywords;
    const date_filter = document.getElementById("DateFilter_DateRange");
    if (date_filter) date_filter.value = 9;
    keyword_field.form.submit();
}

function ophirofoxRealoadOnExpired() {
    const params = new URLSearchParams(window.location.search)
    if (params.get("ErrorCode") == "4000112") {
        // session expirée
        window.history.back();
    }
}

onLoad();