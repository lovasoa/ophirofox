function onLoad() {
    const url = new URL(window.location);
    const search_terms = url.searchParams.get("ophirofox_keywords");
    if (!search_terms) return;
    const stopwords = new Set(['d', 'l', 'et']);
    const keywords = search_terms
        .replace(/œ/g, 'oe')
        .split(/[^\p{L}]+/u)
        .filter(w => !stopwords.has(w))
        .join(' ');
    const keyword_field = document.getElementById("Keywords");
    keyword_field.value = keywords;
    keyword_field.form.submit();
}

onLoad();