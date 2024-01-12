async function createLink() {
    const a = await ophirofoxEuropresseLink();
    a.classList.add();
    return a;
}

function findPremiumBanner() {
    const title = document.querySelector('article.main.premium');
    if (!title) return null;
    return title;
}

async function onLoad() {
    const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    const anchor = premiumBanner.querySelector('h1');
    anchor.appendChild(await createLink());
}

onLoad().catch(console.error);
