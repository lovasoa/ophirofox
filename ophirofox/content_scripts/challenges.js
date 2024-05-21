console.log('Ophirofox loaded');

async function createLink() {
    return await ophirofoxEuropresseLink();
}

async function onLoad() {
    const statusElem = document.querySelector("span.article-abo-tag");
    if (!statusElem) return;
    statusElem.before(await createLink());
}

onLoad().catch(console.error);