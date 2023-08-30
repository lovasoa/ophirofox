async function createLink() {
    const a = await ophirofoxEuropresseLink();
    return a;
}


function findPremiumBanner() {
    const title = document.querySelector(".premium_label.label");
    if (!title) return null;
    const elems = title.parentElement.querySelectorAll("span");
    return [...elems].find(d => d.textContent.includes("Article réservé aux abonnés"))
}

async function onLoad() {
    const head = findPremiumBanner();
    if (!head) return;
    const newDiv = document.createElement('div');
    newDiv.classList.add('europresse-button');
    const title = document.querySelector(".premium_label.label");
    title.after(newDiv);
    newDiv.appendChild(await createLink());
}

onLoad().catch(console.error);
