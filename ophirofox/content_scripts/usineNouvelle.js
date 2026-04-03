function extractKeywords() {
    return document.querySelector("h1")?.textContent;
}
async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    a.style.cssText = `
        font-family: "arimo-bold",Arial,Helvetica,sans-serif;
        border-bottom: 2px solid #000;
        float: right;
        margin-left: 10px;

        font-weight: 600;
    `;
    return a;
}
function findPremiumBanner() {
    const div = document.querySelector(".c-paywall-label");
    if (!div) return null;
    return div.lastElementChild;
}
async function onLoad() {
    const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    premiumBanner.after(await createLink());
}
onLoad().catch(console.error);
