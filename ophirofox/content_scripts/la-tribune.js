function extractKeywords() {
    return document.querySelector('h1').textContent;
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    a.classList.add();
    return a;
}

function findPremiumBanner() {
    const title = document.querySelector('.rev-premium-tag-article-lt__container');
    if (!title) return null;
	const elems = title.querySelectorAll('p');
	return [...elems].find((d) => d.textContent === 'Ce contenu est réservé aux abonnés');
}

async function onLoad() {
    const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    premiumBanner.after(await createLink());
}

onLoad().catch(console.error);
