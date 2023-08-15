async function makeEuropresseUrl() {
    const keywords = extractKeywords();
    return await makeOphirofoxReadingLink(keywords);
}

function extractKeywords() {
    return document.querySelector("h1").textContent;
}

async function createLink() {
    const a = document.createElement("a");
    a.href = await makeEuropresseUrl(new URL(window.location));
    a.textContent = "Lire sur Europresse";
    a.className = "post-premium is-long ophirofox-europresse";
    return a;
}


function findPremiumBanner() {
    const title = document.querySelector("article");
    if (!title) return null;
    const elems = title.parentElement.querySelectorAll("span");
    return [...elems].find(d => d.textContent.includes("Réservé aux abonnés"))
}

async function onLoad() {
    const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    premiumBanner.after(await createLink());
}

onLoad().catch(console.error);
