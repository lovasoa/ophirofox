async function createLink() {
    return await ophirofoxEuropresseLink(extractKeywordsFromTitle());
}

function extractKeywordsFromTitle() {
    const titleElem = document.querySelector('h1.title.title1');
    return titleElem.querySelector('span').textContent;
}

function findPremiumBanner() {
    return document.querySelector('i.ico.ico-lock-round');
}

async function onLoad() {
    const head = document.querySelector('h1.title.title1');
    const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    head.before(await createLink());
}

onLoad().catch(console.error);