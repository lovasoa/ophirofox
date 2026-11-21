function extractKeywordsFromTitle() {
    return document.querySelector("h1.article-titre, h1").textContent;
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywordsFromTitle());
    a.classList.add("bouton");
    return a;
}

async function onLoad() {
    // Les articles réservés aux abonnés n'affichent qu'un aperçu, enveloppé
    // dans des blocs `paywall2-*` (paywall2-apercu, paywall2-bloc…).
    if (!document.querySelector('[class*="paywall2"]')) return;

    // Barre d'outils de l'article (Écouter / Classer / Imprimer / Offrir).
    const actionElem = document.querySelector(".infos-actions");
    if (!actionElem) return;

    const action = document.createElement("span");
    action.className = "sansmarge info-action";
    action.appendChild(await createLink());
    actionElem.appendChild(action);
}

onLoad().catch(console.error);
