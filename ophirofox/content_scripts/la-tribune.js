function injectButton() {
    const banner = document.querySelector('.bg-premium-10');
    if (!banner) return;
    if (banner.querySelector('.ophirofox-europresse')) return;
    const premiumBanner = [...banner.querySelectorAll('p')]
        .find(p => p.textContent === 'Ce contenu est réservé aux abonnés');
    if (!premiumBanner) return;
    ophirofoxEuropresseLink(document.querySelector('h1')?.textContent)
        .then(a => premiumBanner.after(a));
}

function watchPage(callback) {
    // Navigation SPA via History API
    const origPush = history.pushState.bind(history);
    const origReplace = history.replaceState.bind(history);
    history.pushState = (...args) => { origPush(...args); callback(); };
    history.replaceState = (...args) => { origReplace(...args); callback(); };
    window.addEventListener('popstate', callback);

    // MutationObserver pour le rendu dynamique
    const observer = new MutationObserver(callback);
    observer.observe(document.body, { childList: true, subtree: true });
}

watchPage(() => injectButton());
injectButton();