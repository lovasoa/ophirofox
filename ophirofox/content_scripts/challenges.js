console.log('Ophirofox loaded');

async function createLink() {
    return await ophirofoxEuropresseLink();
}

// Variable pour stocker l'observer
let observer = null;

// Variable pour stocker le timer de surveillance post-injection
let checkTimer = null;

// Variable pour suivre si un lien a déjà été ajouté sur l'URL actuelle
let linkAddedForCurrentUrl = false;

// Fonction pour vérifier si le lien existe déjà
function linkExists() {
    // Vérification plus précise - s'assurer qu'on cherche le bon élément
    const existingLink = document.querySelector('.ophirofox-link');
    
    // Ajouter un log pour déboguer
    // console.log('Checking if link exists:', existingLink ? 'YES' : 'NO');
    
    return !!existingLink;
}

// Fonction pour injecter le lien
async function injectLink() {
    // Vérification plus stricte - ne pas injecter si le lien existe déjà
    if (linkExists()) {
        // console.log('Link already exists, skipping injection');
        return false;
    }
    
    const premiumDiv = document.querySelector("div.views-article__premium");
    if (premiumDiv) {
        const link = await createLink();
        
        // S'assurer que la classe est bien définie
        if (!link.classList.contains('ophirofox-link')) {
            link.classList.add('ophirofox-link');
        }
        
        premiumDiv.before(link);

        return true;
    }
    return false;
}

// Fonction pour surveiller si le lien est supprimé après injection
function monitorLinkPresence() {
    // Annuler le timer précédent s'il existe
    if (checkTimer) {
        clearInterval(checkTimer);
    }
    
    // Vérifier toutes les 500ms pendant 5 secondes si le lien existe toujours
    let checkCount = 0;
    checkTimer = setInterval(async () => {
        checkCount++;
        
        // Vérifier explicitement si le lien existe
        const linkPresent = linkExists();
        
        // Si le lien n'existe pas mais qu'il a été ajouté précédemment, essayer de le réinjecter
        if (!linkPresent && linkAddedForCurrentUrl) {
            console.log('Link was removed, reinserting...');
            await injectLink();
        }
        
        // Arrêter la vérification après 5 secondes (10 vérifications)
        if (checkCount >= 10) {
            clearInterval(checkTimer);
            checkTimer = null;
        }
    }, 500);
}

function startObserver() {
    // Nettoyer l'ancien observer s'il existe
    if (observer) {
        observer.disconnect();
    }
    
    // Créer un nouvel observer
    observer = new MutationObserver(async (mutations, obs) => {
        // Vérifier d'abord si le lien existe déjà
        if (linkExists()) {
            linkAddedForCurrentUrl = true; // Mettre à jour l'état
            return; // Ne rien faire si le lien existe déjà
        }
        
        // Si le lien n'a pas encore été ajouté pour cette URL
        if (!linkAddedForCurrentUrl) {
            const premiumDiv = document.querySelector("div.views-article__premium");
            if (premiumDiv) {
                const injected = await injectLink();
                if (injected) {
                    // Marquer que le lien a été ajouté pour cette URL
                    linkAddedForCurrentUrl = true;
                    // Démarrer la surveillance post-injection
                    monitorLinkPresence();
                }
            }
        }
    });
    
    // Démarrer l'observation
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function watchUrlChanges() {
    // Stocker l'URL actuelle
    let currentUrl = window.location.href;
    
    // Surveiller les changements d'URL
    setInterval(() => {
        if (currentUrl !== window.location.href) {
            // console.log('URL changed: ', window.location.href);
            currentUrl = window.location.href;
            
            // Arrêter la surveillance post-injection
            if (checkTimer) {
                clearInterval(checkTimer);
                checkTimer = null;
            }
            
            // Réinitialiser le statut pour la nouvelle URL
            linkAddedForCurrentUrl = false;
            
            // Relancer l'observer quand l'URL change
            startObserver();
        }
    }, 500); // Vérifier toutes les 500ms
}

async function onLoad() {
    // Démarrer l'observer initial
    startObserver();
    
    // Configurer la surveillance des changements d'URL
    watchUrlChanges();
}

// Lancer la fonction principale avec gestion d'erreur
onLoad().catch(console.error);