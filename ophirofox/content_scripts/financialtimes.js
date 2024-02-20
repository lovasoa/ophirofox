function extractKeywords() {
    return document.querySelector("#barrier-page h1").textContent;
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    return a;
}

async function onLoad() {
    const paywall = document.querySelector('#barrier-page');
    if (paywall == null) return;
    const title = document.querySelector("#barrier-page h1");
    title.after(await createLink());
}

onLoad().catch(console.error);