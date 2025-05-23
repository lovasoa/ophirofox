async function createLink() {
    return await ophirofoxEuropresseLink();
}

async function onLoad() {
    const statusElem = document.querySelector(".tag_aboone");
    if (!statusElem) return;
    statusElem.appendChild(await createLink());
}

onLoad().catch(console.error);