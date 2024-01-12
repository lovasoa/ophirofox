async function createLink() {
    const a = await ophirofoxEuropresseLink();
    a.classList.add();
    return a;
}

function findPremiumBanner() {
    const title = document.querySelector('div.header-subscriber');
    if (!title) return null;
    return title;
}

async function onLoad() {
    const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    premiumBanner.appendChild(await createLink());
}

onLoad().catch(console.error);
