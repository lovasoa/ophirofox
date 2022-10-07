async function makeEuropresseUrl(lacroixUrl) {
    const keywords = extractKeywords();
    return await makeOphirofoxReadingLink(keywords);
}

function extractKeywords() {
    return extractKeywordsFromTitle();
}

function extractKeywordsFromTitle() {
    const titleElem = document.querySelector(".tag-subscriber");
    return titleElem && titleElem.textContent;
}

async function createLink() {
    const a = document.createElement("a");
    a.textContent = "Lire sur Europresse";
    a.className = "ophirofox-europresse";
    a.href = await makeEuropresseUrl(new URL(window.location));
    return a;
}

async function onLoad() {
    const statusElem = document.querySelector(".tag-subscriber");
    if (!statusElem) return;
    statusElem.appendChild(await createLink());
}

onLoad().catch(console.error);
