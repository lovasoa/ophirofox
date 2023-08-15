async function createLink() {
    const a = await ophirofoxEuropresseLink(); 
    const span = document.createElement("span");
    span.className = "ophirofox-europresse";
    span.appendChild(a);
    return span;
}

async function onLoad() {
    const reserve = document.querySelector(".ArticleHeader > .subscribers-only");
    if (!reserve) return;

    reserve.appendChild(await createLink());
}

onLoad().catch(console.error);