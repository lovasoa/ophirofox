function extractKeywords() {
    return document.querySelector("h1").textContent;
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    a.classList.add("fig-premium-mark-article__text");
    return a;
}

function findPremiumBanner() {
    const elem = document.querySelector("#qiota-paywall");
    return elem;
}

async function onLoad() {
    const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    document.querySelector('.thematics-list__item').after(await createLink());
}

onLoad().catch(console.error);