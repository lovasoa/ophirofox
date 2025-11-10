function extractKeywords() {
    return document.querySelector('h1').textContent;
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    return a;
}

async function onLoad() {
    const head = document.querySelector('.nr-abo-container');
    head.after(await createLink()); 
}

onLoad().catch(console.error);