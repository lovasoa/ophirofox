function extractKeywords() {
    return document.querySelector("h1").textContent;
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    return a;
}

async function onLoad() {
    const callback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if(mutation.type === 'childList'){
                for(let node of mutation.addedNodes){
                    const subscriptionElem = document.querySelector('section[data-body-id*="cp"]');
                    if(node === subscriptionElem){
                        const subtitle = document.querySelector('#new-article-template h2');
                        createLink().then(function(data){
                            subtitle.after(data);
                        });
                    }
                }
            }
        }
    };
    
    const htmlElement = document.querySelector('#new-article-template');
    const observer = new MutationObserver(callback);
    observer.observe(htmlElement, { childList: true, subtree: true});
}

onLoad().catch(console.error);