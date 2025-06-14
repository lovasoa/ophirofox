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

const isFreeOnAccountCreation = () => {
    const element = document.querySelector('div[class*="registerwall-wrapper"]');
    if (element) {
        return true;
    }
    return false;
};

async function onLoad() {
    if (!isPremium() && !isFreeOnAccountCreation()) return;
    document.querySelector("h1").after(await ophirofoxEuropresseLink(extractKeywords()));
}

onLoad().catch(console.error);