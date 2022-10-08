async function makeEuropresseUrl(lesechosUrl) {
    const keywords = extractKeywords();
    return await makeOphirofoxReadingLink(keywords);
}

function extractKeywords() {
    return extractKeywordsFromTitle();
}

function extractKeywordsFromTitle() {
    const titleElem = document.querySelector("main header h1");
    return titleElem && titleElem.textContent;
}

async function createLink(classNames) {
    const a = document.createElement("a");
    a.textContent = "Lire sur Europresse";
    a.className = `${classNames} ophirofox-europresse`;
    a.href = await makeEuropresseUrl(new URL(window.location));
    return a;
}

async function onLoad() {
    const statusElem = document.querySelector("button[aria-label=\"Lire plus tard\"]");
    if (!statusElem) return;
    // We are in a <div role="group"> to group buttons.
    statusElem.parentNode.parentNode.appendChild(await createLink(statusElem.className));
}

onLoad().catch(console.error);
