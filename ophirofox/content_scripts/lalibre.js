function extractKeywords() {
    return document.querySelector('.ap-Title span:last-child').textContent;
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    return a;
}

async function onLoad() {
    const statusElem = document.querySelector("body:not(.HOMEPAGE-Page) .ap-PaidPicto");
    if (statusElem === null) return;
    statusElem.after(await createLink());
}

onLoad().catch(console.error);
