function extractKeywords() {
    return document.querySelector("h1").textContent;
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    a.classList.add();
    return a;
}


function findPremiumBanner() {
    const title = document.querySelector(".paywall-sticky.width_full.d_flex.pt_3_m.pb_3_m.pt_4_nm.pb_4_nm.pos_stick.ff_gct.fw_r.justify_center");
    if (!title) return null;
    const elems = title.parentElement.querySelectorAll("div");
    return [...elems].find(d => d.textContent.includes("Cet article est réservé aux abonnés"))
}

async function onLoad() {
	const premiumBanner = findPremiumBanner();
    if (!premiumBanner) return;
    const head = document.querySelector("h1");
    head.after(await createLink());
}

onLoad().catch(console.error);
