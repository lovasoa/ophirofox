if (!window.location.hash.includes("ophirofox_reloaded")) {
    window.location.hash += " ophirofox_reloaded";
    document.body.innerHTML = "Authentification...";
    const ifr = document.createElement("iframe");
    ifr.width = ifr.height = 5;
    ifr.onload = (_) => {
        window.location.reload();
    };
    ophirofox_config.then((conf) => {
        ifr.src = conf.AUTH_URL;
        document.body.appendChild(ifr);
    });
}
