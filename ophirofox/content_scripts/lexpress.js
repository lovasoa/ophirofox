function findPremiumBanner() {
    const banner = document.querySelector('.article__premium--icon');
    return banner;
}

function findButtonContainer() {
    return document.querySelector('.article__icons');
}

function buttonExists() {
    return document.querySelector('.europresse-button') !== null;
}

async function createButton() {
    if (buttonExists()) return false; // Bouton déjà présent
    
    const banner = findPremiumBanner();
    if (!banner) return false; // Pas d'article premium
    
    const anchor = findButtonContainer();
    if (!anchor) return false; // Container non trouvé
    
    const newDiv = document.createElement('div');
    newDiv.classList.add('europresse-button');
    anchor.appendChild(newDiv);
    newDiv.appendChild(await ophirofoxEuropresseLink());
    
    console.log('Bouton Europresse ajouté');
    return true;
}

// Fonction principale avec retry
async function initializeButton() {
    const maxRetries = 10;
    let retries = 0;
    
    const tryCreate = async () => {
        try {
            const success = await createButton();
            if (success) return true;
            
            retries++;
            if (retries < maxRetries) {
                setTimeout(tryCreate, 500); // Retry après 500ms
            }
        } catch (error) {
            console.error('Erreur lors de la création du bouton:', error);
            retries++;
            if (retries < maxRetries) {
                setTimeout(tryCreate, 1000); // Retry après 1s en cas d'erreur
            }
        }
    };
    
    await tryCreate();
}

// Observer pour surveiller les changements dans le DOM
function setupObserver() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Vérifier si des nœuds ont été ajoutés/supprimés
            if (mutation.type === 'childList') {
                // Si le bouton a disparu, le recréer
                if (!buttonExists() && findPremiumBanner()) {
                    setTimeout(() => createButton(), 100);
                }
            }
        });
    });
    
    // Observer les changements sur le body et ses enfants
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    return observer;
}

// Gestion des changements d'URL (pour les SPAs)
let currentUrl = window.location.href;
function checkUrlChange() {
    if (currentUrl !== window.location.href) {
        currentUrl = window.location.href;
        console.log('URL changée, réinitialisation du bouton');
        setTimeout(() => initializeButton(), 1000);
    }
}

// Initialisation
async function onLoad() {
    try {
        // Création initiale du bouton
        await initializeButton();
        
        // Mise en place de l'observer
        setupObserver();
        
        // Vérification périodique de l'URL et du bouton
        setInterval(() => {
            checkUrlChange();
            // Vérifier aussi si le bouton existe toujours
            if (findPremiumBanner() && !buttonExists()) {
                createButton();
            }
        }, 2000);
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
    }
}

onLoad().catch(console.error);