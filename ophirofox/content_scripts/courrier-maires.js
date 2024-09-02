async function createLink() {
    return await ophirofoxEuropresseLink();
}

async function onLoad() {
    const statusElem = document.querySelector(".encartEssai");
    const abo = document.querySelector(".etiquetteArt");
    if (!statusElem || !abo) return;
    statusElem.before(await createLink());
}

onLoad().catch(console.error);
