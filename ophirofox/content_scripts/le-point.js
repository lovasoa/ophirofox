async function createLink() {
    return await ophirofoxEuropresseLink();
}

async function onLoad() {
    // Le site ne marque plus les articles abonnés dans la page (.abo) : la balise
    // article:premium le dit
    const premium = document.querySelector('meta[property="article:premium"]');
    if (premium?.content !== "true") return;

    // Dans le même conteneur que « S'abonner sans engagement », juste après : le site donne
    // son style aux liens de .subscribe-btn-container
    const subscribe = document.querySelector(".subscribe-btn-container");
    if (subscribe) {
        subscribe.appendChild(await createLink());
        return;
    }
    const anchor = document.querySelector("h1.title + .subheadline") || document.querySelector("h1");
    if (!anchor) return;
    anchor.after(await createLink());
}

onLoad().catch(console.error);
