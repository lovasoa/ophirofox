//Flag pour ne pas créer multiples bouttons par page.
let isLinkCreated = false

function extractKeywords() {
    const metaElement = document.querySelector('meta[name="og:title"]');
    return metaElement;
}

async function createLink() {
    if(isLinkCreated) return
    isLinkCreated = true
    
    const a = await ophirofoxEuropresseLink(extractKeywords());
    a.className = "ophirofox-europresse";
    const paywall = document.querySelector(".bg-premium-light")
    paywall.appendChild(a);
    return a;
}

// Variable pour stocker le timer de surveillance post-injection
let checkTimer = null;
function watchUrlChanges() {
    let currentUrl = window.location.href;
    
    // Surveiller les changements d'URL
    setInterval(() => {
        if (currentUrl !== window.location.href) {
            currentUrl = window.location.href;
            isLinkCreated = false
            
            // Arrêter la surveillance post-injection
            if (checkTimer) {
                clearInterval(checkTimer);
                checkTimer = null;
            }
            
            // Relancer l'observer quand l'URL change
            startObserver();
        }
    }, 500); // Vérifier toutes les 500ms
}

function startObserver(){
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if(mutation.type === 'attributes' && mutation.attributeName === 'id'){
                if(!isLinkCreated){
                    createLink()
                }
                observer.disconnect();
            }
        }
    };
    const htmlElement = document.querySelector('body');
    //paywall balise
    const classState = htmlElement.classList.contains('.bg-premium-light');
    const observer = new MutationObserver(callback);
    observer.observe(htmlElement, { attributes: true, subtree: true });
}

async function onLoad() {
    startObserver()
    watchUrlChanges()
}

onLoad().catch(console.error);