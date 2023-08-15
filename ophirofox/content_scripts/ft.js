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
    a.className = "fig-premium-mark-article__text ophirofox-europresse";
    return a;
}


function findPremiumBanner() {
    const title = document.querySelector("h1");
    if (!title) return null;
    const elems = title.parentElement.querySelectorAll("span");
    return [...elems].find(d => d.textContent.includes("Keep reading"))
}

async function onLoad() {
    const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    premiumBanner.after(await createLink());
}

onLoad().catch(console.error);
