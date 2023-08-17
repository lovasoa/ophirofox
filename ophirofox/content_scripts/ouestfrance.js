function extractKeywords() {
    return document.querySelector("h1").textContent;
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    a.classList.add("ophirofox-europresse");
    a.style.cssText = 'color:white;border-bottom:none';
    return a;
}


function findPremiumBanner() {
    const title = document.querySelector(".su-premium-info");
    if (!title) return null;
    const elems = title.parentElement.querySelectorAll("span");
    return [...elems].find(d => d.textContent.includes("Article premium"))
}

async function onLoad() {
	const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    const head = document.querySelector("h1");
    head.after(await createLink());
}

onLoad().catch(console.error);
