function extractKeywords() {
    return document.querySelector("h1").textContent;
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    a.classList.add("buttonTypeA", "buttonTypeA--1");
    return a;
}

function findPremiumBanner() {
    const title = document.querySelector("h1");
    if (!title) return null;
    return title.parentElement.querySelector(".notYet") ? title : null;
}

async function onLoad() {
    const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    premiumBanner.after(await createLink());
}

onLoad().catch(console.error);