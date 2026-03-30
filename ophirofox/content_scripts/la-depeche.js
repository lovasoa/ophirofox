async function createLink() {
    const a = await ophirofoxEuropresseLink();
    a.classList.add();
    return a;
}

function findPremiumBanner() {
	return !!document.querySelector(".article__media--premium");
}

async function onLoad() {
	const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    const head = document.querySelector("h1");
    head.after(await createLink());
}

onLoad().catch(console.error);
