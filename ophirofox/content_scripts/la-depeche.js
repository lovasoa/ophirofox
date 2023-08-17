async function createLink() {
    const a = await ophirofoxEuropresseLink();
    a.classList.add();
    return a;
}


function findPremiumBanner() {
    const title = document.querySelector(".article-full__media.article__media--premium.ratio-target");
    if (!title) return null;
    const elems = title.parentElement.querySelectorAll("span");
    return [...elems].find(d => d.classList.contains("article--premium__label"))
}

async function onLoad() {
	const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    const head = document.querySelector("h1");
    head.after(await createLink());
}

onLoad().catch(console.error);
