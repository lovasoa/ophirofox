const article_title = document.querySelector('article.premium-content h1');

function extractKeywords() {
    return article_title.textContent;
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    return a;
}

async function onLoad() {
    const btnPremium = document.querySelector("img[class*='premiumIcon']");
    if (!btnPremium) return;

    btnPremium.after(await createLink());
}

onLoad().catch(console.error);
