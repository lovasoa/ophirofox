function makeEuropresseUrl(lemondeUrl) {
    const target_url = new URL("https://nouveau.europresse.com/Search/Reading");
    target_url.searchParams.set("ophirofox_source", window.location);
    target_url.searchParams.set("ophirofox_keywords", extractKeywords());
    const url = new URL("http://proxy.rubens.ens.fr/login?url=" + target_url);
    return url;
}

function extractKeywords() {
    return document.querySelector("h1").textContent;
}

function createLink() {
    const a = document.createElement("a");
    a.href = makeEuropresseUrl(new URL(window.location));
    a.textContent = "Lire sur Europresse";
    a.className = "ophirofox-europresse";
    return a;
}


function findPremiumBanner() {
    const title = document.querySelector("h1");
    if (!title) return null;
    const divs = title.parentElement.querySelectorAll("div>div");
    return [...divs].find(d => d.textContent.includes("Réservé aux abonnés"))
}

function onLoad() {
    const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    premiumBanner.after(createLink());
}

onLoad();