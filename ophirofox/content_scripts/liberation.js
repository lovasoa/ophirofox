function extractKeywords() {
    return document
      .querySelector("meta[property='og:title']")
      .getAttribute("content");
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    a.classList.add("ribbon-premium");
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
