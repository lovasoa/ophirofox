function findPremiumBanner() {
    const title = document.querySelector(".article-page-header");
    if (!title) return null;
    const elems = title.parentElement.querySelectorAll("a");
    return [...elems].find(d => d.href.includes("ph-abo"))
}

async function onLoad() {
    const head = findPremiumBanner();
    if (!head) return;
    head.after(await ophirofoxEuropresseLink());
}

onLoad().catch(console.error);