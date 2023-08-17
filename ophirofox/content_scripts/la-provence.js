async function createLink() {
    const a = await ophirofoxEuropresseLink();
    a.classList.add();
    return a;
}


function findPremiumBanner() {
    const title = document.querySelector(".header-article-premium__stamp");
    if (!title) return null;
    const elems = title.parentElement.querySelectorAll("span");
    return [...elems].find(d => d.textContent.includes("Article réservé aux abonnés"))
}

async function onLoad() {
	const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    premiumBanner.appendChild(await createLink());
}

onLoad().catch(console.error);
