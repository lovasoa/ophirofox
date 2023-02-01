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
	
	const div = document.createElement("div");
    div.className = "field-name-field-news-auteur ophirofox-europresse";
	
	div.appendChild(a);
	
    return div;
}

async function onLoad() {
	const reserve = document.querySelector(".qiota_reserve");
    if (!reserve) return;
	
    const auteurElem = document.querySelector(".group-ft-auteur-date-media");
    if (!auteurElem) return;
	
    auteurElem.appendChild(await createLink());
}

onLoad().catch(console.error);