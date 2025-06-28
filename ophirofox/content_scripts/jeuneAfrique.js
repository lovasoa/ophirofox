async function createLink() {
    const a = await ophirofoxEuropresseLink();
    a.className = "ophirofox-europresse";
    return a;
}

async function onLoad() {
    const header = document.querySelector(".article__header");
    if (!header) return;
    header.appendChild(await createLink());
}

onLoad().catch(console.error);