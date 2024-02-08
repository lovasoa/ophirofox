function extractKeywords() {
    return document
        .querySelector("meta[property='og:title']")
        .getAttribute('content');
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    return a;
}

function findPremiumBanner() {
    const anchor = document.querySelector(
        'div.TypologyArticle__BlockPremium-sc-1vro4tp-2'
    );
    if (!anchor) {
        return;
    }
    return anchor;
}

async function onLoad(premiumBanner) {
    if (premiumBanner) {
        /* 
      The UI is reactive (and DOM rewritten), so we need to wait for some nodes to be rewritten to the DOM 
      before we can add our link. It seems that the React components are added to the DOM in a particular order. 
      
      With heavy loading, the MutationObserver execution is too late, and only catch .dossier-feed class.
      After caching, we can rely on the .article-body-paywall added node.
      
      Weird choices for a nearly-static content-driven website with SEO concerns.
    */
        const observer = new MutationObserver(async (mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.addedNodes.length > 0) {
                    const addedNode = mutation.addedNodes[0];

                    if (
                        addedNode.classList.contains('dossier-feed') ||
                        addedNode.classList.contains('article-body-paywall')
                    ) {
                        observer.disconnect();

                        // Not sure if premiumBanner is (and will be) still valid after DOM rewrite
                        if (
                            !document.querySelector(
                                'div.TypologyArticle__BlockPremium-sc-1vro4tp-2 + a.ophirofox-europresse'
                            )
                        ) {
                            findPremiumBanner().after(await createLink());
                            console.log(
                                'Ophirofox injected after React DOM rewrite'
                            );
                            break;
                        }
                    }
                }
            }
        });

        observer.observe(document.querySelector('#fusion-app'), {
            childList: true,
            subtree: true,
        });
    }
}

// Edge-cases, it costs nothing to try to add it *à l'anciene*
createLink().then((link) => {
    const premiumBanner = findPremiumBanner();
    if (premiumBanner) {
        premiumBanner.after(link);
        console.log('Ophirofox injected');
    }
    onLoad(premiumBanner);
});
