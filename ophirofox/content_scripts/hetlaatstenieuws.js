function extractKeywords() {
    const titleElem = document.querySelector("h1").childNodes[0];
    return titleElem && titleElem.textContent;
}

let buttonAdded = false;

async function addEuropresseButton() {
    if(!buttonAdded) {
        const elts = document.querySelectorAll('.tm-account');
        if (elts) {
            for(let elt of elts){
                const a = await ophirofoxEuropresseLink(extractKeywords());
                elt.after(a);
                buttonAdded = true;
            }
        }
    }
}

async function onLoad() {
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if(mutation.type === 'attributes' && mutation.attributeName === 'class'){
                const newClassState = mutation.target.classList.contains('js-tm-backdrop-active');
                if(classState !== newClassState){
                    addEuropresseButton();
                    observer.disconnect();
                }
            }
        }
    };

    const htmlElement = document.querySelector('body');
    const classState = htmlElement.classList.contains('js-tm-backdrop-active');
    const observer = new MutationObserver(callback);
    observer.observe(htmlElement, { attributes: true, subtree: true });
}

onLoad().catch(console.error);