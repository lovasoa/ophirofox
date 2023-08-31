const title = document.querySelector(".premium_label.label");
    
function findPremiumBanner() {
    if (!title) return null;
    const elems = title.parentElement.querySelectorAll("span");
    return [...elems].find(d => d.textContent.includes("Article réservé aux abonnés"))
}

async function onLoad() {
    const head = findPremiumBanner();
    if (!head) return;
    const newDiv = document.createElement('div');
    newDiv.classList.add('europresse-button');
    title.after(newDiv);
    newDiv.appendChild(await ophirofoxEuropresseLink());
}

onLoad().catch(console.error);