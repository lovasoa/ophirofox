function extractKeywords() {
    const titleElem = document.querySelector("h1").childNodes[0];
    return titleElem && titleElem.textContent;
}

let buttonAdded = false;

async function addEuropresseButton() {
    if (!buttonAdded) {
        buttonAdded = true;
        const elt = document.querySelector("button[aria-label=Commenter]")?.parentElement?.parentElement;
        if (elt) {
            const a = await ophirofoxEuropresseLink(extractKeywords());
            elt.appendChild(a);
        }
    }
}

async function onLoad() {

    /* 2 cases:
    1. either a page is initially loaded,  and we must wait for the actual end of loading (determined
        by a new meta with name ad:postAcces) and add the button (this is the first observer).
    2. Or a page is newly routed (for instance, when one goes from the homepage to an article) :
        - it is detected with the second observer that watches for changes in <title> and reset the button
        - we wait for the end of actual loading of the new content by checking if meta[name="ad:postAccess"] exist.
    */

    const isPremium = (metaElement) => {
        if (metaElement.content == 'subscribers') {
            return true;
        }
        return false;
    };

    // Observer [ Direct URL Access ]
    const callbackDirectAccess = (mutationList, observer) => {
        const metaElement = document.querySelector('meta[name="ad:postAccess"]');
        if (metaElement) {
            if (isPremium(metaElement)) {
                addEuropresseButton();
            }
            observer.disconnect();
            return;
        }
        for (const mutation of mutationList) {
            for (const e of mutation.addedNodes) {
                if (e.name == "ad:postAccess") {
                    if (isPremium(e)) {
                        addEuropresseButton();
                    }
                    observer.disconnect();
                    return;
                }
            }
        }
    };

    const observerDirectAccess = new MutationObserver(callbackDirectAccess);
    observerDirectAccess.observe(document.body, {
        childList: true,
        subtree: false
    });

    // Observer [ Dynamic page Loading ]
    const callbackTitle = (mutationList, observer) => {
        buttonAdded = false;
        const metaElement = document.querySelector('meta[name="ad:postAccess"]');
        if (metaElement) {
            if (isPremium(metaElement)) {
                addEuropresseButton();
            }
        }
    };

    const observerTitle = new MutationObserver(callbackTitle);
    observerTitle.observe(document.querySelector('title'), {
        childList: true,
        subtree: false
    });
}

onLoad().catch(console.error);