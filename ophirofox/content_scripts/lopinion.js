async function createLink() {
    const a = await ophirofoxEuropresseLink();
    a.classList.add();
    return a;
}


function findPremiumBanner() {
    const title = document.querySelector("div.paywall");
    if (!title) return null;
    return title;
}

async function onLoad() {
	const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    const anchor = document.querySelector(".Article-date");
    anchor.after(await createLink());
}

onLoad().catch(console.error);