function extractKeywords() {
    const title = document.querySelector("h1, .titleheader");
    return title?.textContent?.trim();
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    a.classList.add("ophirofox-europresse");
    return a;
}

function findPremiumBanner() {
    const premium = document.querySelector("span.premium");
    if (!premium?.textContent.includes("Abo")) return null;
    return premium;
}

async function onLoad() {
    if (window.location.pathname === "/") return;
    const premium = findPremiumBanner();
    if (!premium) return;
    premium.before(await createLink());
}

onLoad().catch(console.error);
