if (document.body.textContent.match("Désolé ! Une erreur est survenue")) {
    const ophirofox_target = window.location;
    const service = `https://nouveau-europresse-com.proxy.rubens.ens.fr/Search/Reading?ophirofox_target=${encodeURIComponent(ophirofox_target)}`;
    window.location = "https://sso.ens.fr/cas/login?service=" + encodeURIComponent(service);
}