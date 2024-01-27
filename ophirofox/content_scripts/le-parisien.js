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

function findPremiumBanner(bannerSelector) {
    if (!bannerSelector) return null;
    const elems = bannerSelector.parentElement.querySelectorAll("div");
    return [...elems].find(d => d.textContent.includes("Cet article est réservé aux abonnés"));
}

async function onLoad() {
    const bannerSelector = document.querySelector(".paywall-sticky.width_full.d_flex.pt_3_m.pb_3_m.pt_4_nm.pb_4_nm.pos_stick.ff_gct.fw_r.justify_center");
    if (findPremiumBanner(bannerSelector)) {
        addEuropresseButton();
    } 
    else {
        /* Premium banner couldn't be found, use MutationObserver as fallback */
        var elementFound = false;
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                for (const e of mutation.addedNodes) {
                    const bannerSelectorString = 'paywall-sticky width_full d_flex pt_3_m pb_3_m pt_4_nm pb_4_nm pos_stick ff_gct fw_r justify_center';
                    if(e.className == bannerSelectorString) {
                        observer.disconnect();
                        elementFound = true;
                        if(findPremiumBanner(e)) {
                            addEuropresseButton();
                        }
                        break;
                    }                    
                }
                if (elementFound) {
                    break;
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(document.body, { childList: true});
    }
}

onLoad().catch(console.error);
