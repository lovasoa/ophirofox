function extractKeywords() {
    return document
        .querySelector("meta[property='og:title']")
        .getAttribute("content");
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    return a;
}

function findPremiumBanner() {
    const anchor = document.querySelector('#regwall-container');
    if (!anchor) {
        return;
    }
    return anchor;
}

async function onLoad() {
    const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    premiumBanner.parentElement.before(await createLink());
    document.querySelector('h1').after(await createLink())
}

onLoad().catch(console.error);