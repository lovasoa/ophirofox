async function createLink() {
    const a = await ophirofoxEuropresseLink();
    a.classList.add();
    return a;
}


function findPremiumBanner() {
    const title = document.querySelector(".non-paywall");
    if (!title) return null;
    const elems = title.parentElement.querySelectorAll("span");
    return [...elems].find(d => d.classList.contains("flagPaid"))
}

async function onLoad() {
	const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    const head = document.querySelector("h1");
    head.before(await createLink());
}

onLoad().catch(console.error);


