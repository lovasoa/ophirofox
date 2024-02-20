function extractKeywords() {
    const titleElem = document.querySelector("h1#main-content");
    return titleElem.textContent;
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    return a;
}

async function onLoad() {
    let linkAdded = false;
    const callback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if(!linkAdded){
                const paywall_modal = document.querySelector('[data-qa="overlay-container"]');
                const paywall_bottom = document.querySelector('#wall-bottom-drawer');
                if(paywall_modal !== null || paywall_bottom !== null){
                    const title_bottom = document.querySelector('h1#HEADER');
                    createLink().then(function(data){
                        title_bottom.after(data);
                    });
                    linkAdded = true;
                    observer.disconnect();
                }
            }
        }
    };

    const htmlElement = document.querySelector('body');
    const observer = new MutationObserver(callback);
    observer.observe(htmlElement, { attributes: true, subtree: true });
}

onLoad().catch(console.error);