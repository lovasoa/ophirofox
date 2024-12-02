let buttonAdded = false;
const article_title = document.querySelector('header[data-testid="article-header"] h1');

function extractKeywords() {
    return article_title.textContent;
}

async function createLink(elt) {
    if (elt && buttonAdded == false){
        const a = await ophirofoxEuropresseLink(extractKeywords());
        elt.after(a);
        console.log(elt);
        if(elt !== article_title){
            //second link is in shadow dom context -> no access to stylesheet
            a.style.display = "block"
            a.style.width = "35%";
            a.style.margin = "0.5rem auto";
            a.style.padding = "0.5rem 0";
            a.style.borderRadius = "0.3rem";
            a.style.backgroundColor = "#ffc700";
            a.style.color = "#000";
            a.style.textDecoration = "none";
            a.style.textAlign = "center";
        }
    }
}

async function onLoad() {
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if(mutation.type === 'childList'){
                for(let node of mutation.addedNodes){
                    const paywall_modal = document.querySelector('.PSAPAG_root');
                    if(paywall_modal){;
                        const shadow_content = document.querySelector('.PSAPAG_root').shadowRoot;
                        const modal_content = shadow_content.firstChild.lastChild;
                        createLink(article_title);
                        createLink(modal_content);

                        buttonAdded = true;
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