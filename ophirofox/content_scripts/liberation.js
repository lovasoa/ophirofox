console.log('Ophirofox injected');

function extractKeywords() {
    return document
      .querySelector("meta[property='og:title']")
      .getAttribute("content");
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    return a;
}

function findPremiumBanner() {
  const anchor = document.querySelector('div.TypologyArticle__BlockPremium-sc-1vro4tp-2');
  if (!anchor) {
    return;
  }
  return anchor;
}

async function onLoad() {
    const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    premiumBanner.appendChild(await createLink());
}

onLoad();
