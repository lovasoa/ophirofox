function extractKeywords() {
    const titleElem = document.querySelector("h1").childNodes[0];
    return titleElem && titleElem.textContent;
}

let buttonAdded = false;

async function addEuropresseButton() {
    if (!buttonAdded) {
        const elt = document.querySelector("button[aria-label=Commenter]")?.parentElement?.parentElement;
        if (elt) {
            const a = await ophirofoxEuropresseLink(extractKeywords());
            elt.appendChild(a);
            buttonAdded = true;
        }
    }
}

async function onLoad() {

    /* 2 cases:
    1. either a page is initially loaded,  and we must wait for the actual end of loading (determined
        by a new meta with name ad:postAcces) and add the button (this is the first observer).
    2. Or a page is newly routed (for instance, when one goes from the homepage to an article) :
        - it is detected with the second observer that watches for changes in <title> and reset the button
        - we wait for the end of actual loading of the new content by observing <main><meta content>.
    */

    const isPremium = () => {
        if (document.querySelector("meta[name='ad:postAccess']").content == 'subscribers') {
            return true;
        }
        return false;
    };

    const callback = (mutationList, observer) => {
        if (document.querySelector('meta[name="ad:postAccess"]')) {
            addEuropresseButton();
            observer.disconnect();
            return;
        }
        for (const mutation of mutationList) {
            for (const e of mutation.addedNodes) {
                if (e.name == "ad:postAccess") {
                    if (isPremium())
                        addEuropresseButton();
                }
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(document.body, {
        childList: true
    });

    const observerTitle = new MutationObserver(() => {
        buttonAdded = false;
        if (isPremium())
            addEuropresseButton();
    });

    const title = document.querySelector("title")
    observerTitle.observe(title, {
        childList: true,
        subtree: false
    });

    const observerMain = new MutationObserver(() => {
        addEuropresseButton();
    });
    const main = document.querySelector("main meta[content]")
    observerMain.observe(main, {
        childList: true,
        subtree: false
    });
}

onLoad().catch(console.error);