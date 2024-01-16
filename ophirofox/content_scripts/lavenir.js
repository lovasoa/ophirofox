function extractKeywords() {
    return document.querySelector("h1").textContent;
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    return a;
}

async function onLoad() {
    const statusElem = document.getElementsByClassName("ap-PaidPicto");
    if (statusElem.length == 0) return;
    statusElem[0].after(await createLink());
}

onLoad().catch(console.error);