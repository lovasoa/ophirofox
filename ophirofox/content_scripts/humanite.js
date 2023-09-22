async function createLink() {
    const a = await ophirofoxEuropresseLink();
    a.className = "rubric t-header-small c-red ophirofox-europresse";
    return a;
}

async function onLoad() {
    const reserve = document.querySelector("main .single__categories .u-icon-32");
    if (!reserve) return;

    const auteurElem = document.querySelector(".single__content__text__published");
    if (!auteurElem) return;

    auteurElem.appendChild(await createLink());
}

onLoad().catch(console.error);