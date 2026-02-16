function extractKeywords() {
    const titleElem = document.querySelector(".c-paywall__header-title");
    return titleElem && titleElem.textContent;
}

let buttonAdded = false;

async function addEuropresseButton() {
    if(!buttonAdded) {
        const elt = document.querySelector('.c-paywall__inner form button');
        if (elt) {
            const a = await ophirofoxEuropresseLink(extractKeywords());
            elt.after(a);
            buttonAdded = true;
        }
    }
}

async function onLoad() {
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if(mutation.type === 'attributes' && mutation.attributeName === 'class'){
                const newClassState = mutation.target.classList.contains('is-hidden');
                if(classState !== newClassState){
                    addEuropresseButton();
                }
            }
        }
    };

    const paywallModal = document.querySelector('#paywall-modal');
    const classState = paywallModal.classList.contains('is-hidden');
    const observer = new MutationObserver(callback);
    observer.observe(paywallModal, { attributes: true, subtree: true });
}

onLoad().catch(console.error);
