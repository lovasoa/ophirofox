async function makeEuropresseUrl() {
    const keywords = extractKeywords();
    return await makeOphirofoxReadingLink(keywords);
}

function extractKeywords() {
    return document.querySelector("h1").textContent;
}

async function createLink() {
    const a = document.createElement("a");
    a.href = await makeEuropresseUrl(new URL(window.location));
    a.textContent = "Lire sur Europresse";
    a.className = "info-reserved ophirofox-europresse";
    return a;
}

async function onLoad() {
    const statusElem = document.getElementsByClassName("info-reserved");
    if (statusElem.length == 0) return;
    statusElem[0].after(await createLink());
}

onLoad().catch(console.error);