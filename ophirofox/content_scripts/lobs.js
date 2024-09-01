function extractKeywords() {
    return document.querySelector("h1").textContent;
}

const isPremium = () => {
    const metaElement = document.querySelector('meta[name="ad:teaser"]');
    if (metaElement) {
        if (metaElement.content === 'true')
          return true;
    }
    return false;
};

async function onLoad() {
    if (!isPremium()) return;
    document.querySelector("h1").after(await ophirofoxEuropresseLink(extractKeywords()));
}

onLoad().catch(console.error);