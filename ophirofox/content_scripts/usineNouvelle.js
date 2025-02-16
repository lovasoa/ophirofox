function extractKeywords() {
    return document.querySelector(".editoSocialBar__item[data-title]").dataset.title
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    a.style = 'font-family: "arimo-bold",Arial,Helvetica,sans-serif; border-bottom: 2px solid #000; margin-left : 1rem'
    return a;
}

function findPremiumBanner() {
    const div = document.querySelector(".epPayWallTop");
    if (!div) return null;
    console.log('all div', div)
    console.log('last child', div.lastElementChild)
    return elem = div.lastElementChild;
}

async function onLoad() {
    const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    premiumBanner.after(await createLink());
}

onLoad().catch(console.error);