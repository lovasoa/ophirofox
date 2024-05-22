function extractKeywords() {
    return document.querySelector('h1[itemprop="Headline"]').textContent;
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    a.classList.add();
    return a;
}

function findPremiumBanner() {
    const title = document.querySelector('.facade-container');
    if (!title) return null;
    const elems = title.querySelectorAll('span');
    return [...elems].find((d) => d.textContent === 'Réservé aux abonnés');
}

async function onLoad() {
    const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    premiumBanner.after(await createLink());
}

onLoad().catch(console.error);
