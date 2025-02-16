/**
 * 
 * @description titles don't match between europress and origin site. Use lead Paragraph instead.
 * @return truncated first part of paragraph. Dont cut off words
 */
function extractKeywords() {
    let edito =  document.querySelector(".editoTitleType9 > p").textContent;
    console.log('edito length', edito.length)
    if (edito.length > 75){
        edito = edito.substring(0, edito.lastIndexOf(' ', 75));
    }
    return edito
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
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