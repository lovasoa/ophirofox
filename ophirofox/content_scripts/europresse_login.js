if (!window.location.hash.includes("ophirofox_reloaded")) {
    window.location.hash += " ophirofox_reloaded";
    document.body.innerHTML = "Authentification...";
    const ifr = document.createElement("iframe");
    ifr.width = ifr.height = 5;
    ifr.src = "https://proxy.rubens.ens.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=PSLT_1";
    ifr.onload = _ => {
        window.location.reload();
    }
    document.body.appendChild(ifr);
}
