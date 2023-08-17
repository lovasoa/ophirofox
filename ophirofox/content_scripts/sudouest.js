function extractKeywords() {
    return document.querySelector("h1").textContent;
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    a.classList.add();
    return a;
}


function findPremiumBanner() {
    const title = document.querySelector(".tag.color-premium.uppercase");
    if (!title) return null;
    const elems = title.parentElement.querySelectorAll("span");
    return [...elems].find(d => d.textContent.includes("Réservé aux abonnés"))
}

async function onLoad() {
    const head = document.querySelector(".article-premium-header");
    if (!head) return;
    head.appendChild(await createLink());
}

onLoad().catch(console.error);
