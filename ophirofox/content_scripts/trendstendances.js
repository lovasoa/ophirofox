function extractKeywords() {
    const titleElem = document.querySelector("h1").childNodes[0];
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

    const htmlElement = document.querySelector('#paywall-modal');
    const classState = htmlElement.classList.contains('is-hidden');
    const observer = new MutationObserver(callback);
    observer.observe(htmlElement, { attributes: true, subtree: true });
}

onLoad().catch(console.error);
