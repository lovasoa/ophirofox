async function createLink() {
    const a = await ophirofoxEuropresseLink();
    a.classList.add("info-reserved");
    return a;
}

async function onLoad() {
    const statusElem = document.getElementsByClassName("info-reserved");
    if (statusElem.length == 0) return;
    statusElem[0].after(await createLink());
}

onLoad().catch(console.error);