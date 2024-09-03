async function createLink() {
    const a = await ophirofoxEuropresseLink();
    a.classList.add();
    return a;
}


function findPremiumBanner() {
    const array = document.querySelectorAll(".rev-margin-0.rev-text-xs-bold");
    const reserve = Array.from(array).find(p => p.textContent.includes("Article réservé aux abonnés")); 
    if (!reserve) return null;
    return reserve
}

async function onLoad() {
	const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    premiumBanner.appendChild(await createLink());
}

onLoad().catch(console.error);
