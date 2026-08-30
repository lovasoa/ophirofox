const PAYWALL_LABEL_SELECTOR = ".c-paywall-label";

function extractKeywords() {
    return document.querySelector("h1")?.textContent;
}

async function createLink() {
    return await ophirofoxEuropresseLink(extractKeywords());
}

function findPremiumBanner() {
    return [...document.querySelectorAll(PAYWALL_LABEL_SELECTOR)]
        .find((label) => label.textContent.includes("Réservé aux abonnés"));
}

async function onLoad() {
    if (document.querySelector(".ophirofox-europresse")) return;
    const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    premiumBanner.append(document.createTextNode(" • "), await createLink());
}

onLoad().catch(console.error);
