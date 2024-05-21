function extractKeywords() {
    return document.querySelector("header h1").textContent;
}

let buttonAdded = false;

async function createLink(elt) {
    if (elt && buttonAdded == false){
        const a = await ophirofoxEuropresseLink(extractKeywords());
        elt.after(a);
    }
}

async function onLoad() {   
    // Lien Europresse dans le corps de l'article
    const paywall = document.querySelector('[data-cj-root="subscription-wall"]');
    const article_title = document.querySelector('header h1');
    
    if(paywall){
        createLink(article_title);
    }
    
    // Lien Europresse dans la modale, au chargement
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if(mutation.type === 'childList'){
                for(let node of mutation.addedNodes){
                    const paywall_modal = document.querySelector('.cj-root');
                    if(paywall_modal){
                        const subscriptionForm = document.querySelector('[data-current-screen="StopEmailIdentification"] form');
                        createLink(subscriptionForm);
                        buttonAdded = true;
                        subscriptionForm.nextElementSibling.classList.add('ophirofox-modal-link');
                        observer.disconnect();
                    }
                }
            }
        }
    };
        
    const htmlElement = document.querySelector('body');
    const observer = new MutationObserver(callback);
    observer.observe(htmlElement, { childList: true });
}

onLoad().catch(console.error);