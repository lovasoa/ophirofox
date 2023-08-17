function extractKeywords() {
    return document.querySelector("h1").textContent;
}

async function createLink() {
    const span = document.createElement("span");
    span.textContent = "Lire sur Europresse";
    span.className = "premium-message ophirofox-europresse";

    const a = await ophirofoxEuropresseLink(extractKeywords());
    a.classList.add("btn", "btn--premium");
    a.innerHTML = "";
    a.appendChild(span);

    return a;
}

async function onLoad() {
    const reserve = document.querySelector(".premium-message");
    if (!reserve) return;

    reserve.parentElement.appendChild(await createLink());
}

onLoad().catch(console.error);