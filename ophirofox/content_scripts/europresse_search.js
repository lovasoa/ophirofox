function onLoad() {
    const url = new URL(window.location);
    const search_terms = url.searchParams.get("ophirofox_keywords");
    if (!search_terms) return;
    const keyword_field = document.getElementById("Keywords");
    keyword_field.value = search_terms;
    keyword_field.form.submit();
}

onLoad();