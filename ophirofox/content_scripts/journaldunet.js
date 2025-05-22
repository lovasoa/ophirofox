async function createLink() {
    return await ophirofoxEuropresseLink();
}

async function onLoad() {
    const statusElem = document.querySelector(".entry.entry_reg_wall");
    if (!statusElem) return;
    document.querySelector('h1').appendChild(await createLink());
}

onLoad().catch(console.error);