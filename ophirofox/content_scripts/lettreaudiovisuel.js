function extractKeywords() {
    return document.querySelector("h1").textContent;
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    a.classList.add("is-btn");
    return a;
}

async function onLoad() {    
    const paywall = document.querySelector(".mepr-unauthorized-message");
    paywall.before(await createLink());

    const header = document.querySelector("h1");
    header.after(await createLink());
}

onLoad().catch(console.error);
