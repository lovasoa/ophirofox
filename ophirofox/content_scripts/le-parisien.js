
function extractKeywords() {
    return document.querySelector("h1").textContent;
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    a.classList.add();
    return a;
}

async function addEuropresseButton() {
    const head = document.querySelector("h1");
    head.after(await createLink());
}

async function onLoad() {
    const bannerSelector = document.querySelector(".btn-subscribe");
    if (bannerSelector) {
        addEuropresseButton();
    } else {
        // console.log("Premium banner couldn't be found")
        /* Premium banner couldn't be found, use MutationObserver as fallback */
        var elementFound = false;
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                for (const e of mutation.addedNodes) {
                    const bannerSelectorString = 'btn-subscribe';
                    if (e.className == bannerSelectorString) {
                        observer.disconnect();
                        elementFound = true;
                        addEuropresseButton();
                        break;
                    }
                }
                if (elementFound) {
                    break;
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(document.body, {
            childList: true
        });
    }
}

onLoad().catch(console.error);