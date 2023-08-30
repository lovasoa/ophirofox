async function createLink() {
    const a = await ophirofoxEuropresseLink();
    a.classList.add();
    a.textContent = '(Lire sur Europresse)';
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
    head.after(await createLink());
}

onLoad().catch(console.error);
