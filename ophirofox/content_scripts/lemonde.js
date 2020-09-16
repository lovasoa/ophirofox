const BASE = 'https://nouveau-europresse-com.proxy.rubens.ens.fr'

function makeEuropresseUrl(lemondeUrl) {
    const m = lemondeUrl.pathname.match(/(\d{4})\/(\d{2})\/(\d{2})\/.*?(\d+_\d+).html/);
    if (!m) throw new Error("Format d'URL lemonde inconnu");
    const target_url = new URL("https://nouveau-europresse-com.proxy.rubens.ens.fr/Search/Reading");
    //target_url.searchParams.set("docKey", `news·${m[1]}${m[2]}${m[3]}·LMF·${m[4]}`);
    target_url.searchParams.set("ophirofox_source", window.location);
    //target_url.hash = "docText";
    const url = new URL("http://proxy.rubens.ens.fr/login?url=" + target_url);
    return url;
}

function createLink() {
    const a = document.createElement("a");
    a.href = makeEuropresseUrl(new URL(window.location));
    a.textContent = "Lire sur Europresse";
    a.className = "btn btn--premium ophirofox-europresse";
    return a;
}

function onLoad() {
    const statusElem = document.querySelector(".article__status");
    if (!statusElem) return;
    statusElem.appendChild(createLink());
}

onLoad();