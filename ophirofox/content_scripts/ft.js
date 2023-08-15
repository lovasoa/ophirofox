async function makeEuropresseUrl(lemondeUrl) {
    const keywords = extractKeywords();
    return await makeOphirofoxReadingLink(keywords);
}

function extractKeywords() {
    return document.querySelector("title").textContent;
}

async function createLink() {
    const a = document.createElement("a");
    a.textContent = "Lire sur Europresse";
    a.className = "btn btn--premium ophirofox-europresse";
    a.href = await makeEuropresseUrl(new URL(window.location));
    return a;
}

async function onLoad() {
    const payArticle = document.querySelector('.opt unlock_banner');
    if (!payArticle) return;
    payArticle.after(await createLink());
}

onLoad().catch(console.error);
