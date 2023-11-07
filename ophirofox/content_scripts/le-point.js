async function createLink() {
    const a = await ophirofoxEuropresseLink();
    a.classList.add("btn");
    return a;
}

async function onLoad() {
    const reserve = document.querySelector(".abo");
    if (!reserve) return;

    reserve.after(await createLink());
}

onLoad().catch(console.error);