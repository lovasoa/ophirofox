function extractKeywords() {
    return document.querySelector("h1").textContent;
}

let buttonAdded = false;

async function createLink() {
    const subscriptionElem = document.querySelector('[data-current-screen="StopEmailIdentification"] form');
    if (subscriptionElem && buttonAdded == false){
        const a = await ophirofoxEuropresseLink(extractKeywords());
        subscriptionElem.after(a);
    }
}

async function onLoad() {
    // Lien Europresse dans la modale au chargement de l'article
    createLink();

    // Lien Europresse dans le corps de l'article, une fois la modale fermée
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if(mutation.removedNodes.length > 0){
                createLink();
                buttonAdded = true;
            }
        }
    };

    const htmlElement = document.querySelector('.cj-root');
    const observer = new MutationObserver(callback);
    observer.observe(htmlElement, { childList: true});
}

onLoad().catch(console.error);