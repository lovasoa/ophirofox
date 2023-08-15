function extractKeywords() {
    return document.querySelector("h1").textContent;
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    a.classList.add("fig-premium-mark-article__text");
    return a;
}


function findPremiumBanner() {
    const title = document.querySelector("h1");
    if (!title) return null;
    const elems = title.parentElement.querySelectorAll("span");
    return [...elems].find(d => d.textContent.includes("réservé aux abonnés"))
}

async function onLoad() {
    const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    premiumBanner.after(await createLink());
}

onLoad().catch(console.error);
