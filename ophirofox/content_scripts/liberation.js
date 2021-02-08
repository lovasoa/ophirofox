async function makeEuropresseUrl() {
    const keywords = extractKeywords(window.location);
    return await makeOphirofoxReadingLink(keywords);
}

function extractKeywords() {
    return document
      .querySelector("meta[property='og:title']")
      .getAttribute("content");
}

async function createLink() {
    const a = document.createElement("a");
    a.href = await makeEuropresseUrl(new URL(window.location));
    a.textContent = "Lire sur Europresse";
    a.className = "ribbon-premium ophirofox-europresse";
    return a;
}

async function onLoad() {
    const reserve = document.evaluate(
      "//*[contains(text(), 'réservé aux abonnés')]",
      document.body,
      null,
      XPathResult.UNORDERED_NODE_ITERATOR_TYPE
    ).iterateNext();
    if (!reserve) return;
    reserve.appendChild(await createLink());
}

onLoad();
