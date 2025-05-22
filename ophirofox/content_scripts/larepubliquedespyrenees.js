async function createLink() {
    return await ophirofoxEuropresseLink();
}

async function onLoad() {
    const statusElem = document.querySelector(".tag.color-premium.uppercase");
    if (!statusElem) return;
    statusElem.appendChild(await createLink());
}

onLoad().catch(console.error);