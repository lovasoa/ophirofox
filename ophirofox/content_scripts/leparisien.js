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
    a.className = "lien_europresse";
    return a;
}

async function onLoad() {
    const reserve = document.querySelector(".paywall-article-section");
    if (reserve) {
      const lien = await createLink();
      const titreH1 = document.querySelector(".breadcrumb a:last-child");
      titreH1.insertAdjacentElement("afterend", lien);
    }
}
  
onLoad().catch(console.error);