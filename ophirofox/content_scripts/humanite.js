async function createLink() {
    const a = await ophirofoxEuropresseLink();
    a.className = "rubric t-header-small c-red ophirofox-europresse";
    return a;
}

async function onLoad() {
    const reserve = document.querySelector("#poool-paywall");
    if (!reserve) return;

    const auteurElem = document.querySelector(".single__author");
    if (!auteurElem) return;

    auteurElem.appendChild(await createLink());
}

onLoad().catch(console.error);