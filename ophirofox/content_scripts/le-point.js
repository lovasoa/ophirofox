async function makeEuropresseUrl() {
    const keywords = extractKeywords();
    return await makeOphirofoxReadingLink(keywords);
}

function extractKeywords() {
    return document.querySelector("h1").textContent;
}

async function createLink() {
    const a = document.createElement("a");
	a.textContent = "Lire sur Europresse";
    a.href = await makeEuropresseUrl(new URL(window.location));
	
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