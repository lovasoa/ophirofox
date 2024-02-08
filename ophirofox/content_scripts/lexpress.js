function findPremiumBanner() {
    const banner = document.querySelector('.article__premium--icon');
    return banner;
}

async function onLoad() {
    const banner = findPremiumBanner();
    if (!banner) return;
    const anchor = document.querySelector(
        '.article__metas__container__info'
    );
    const newDiv = document.createElement('div');
    newDiv.classList.add('europresse-button');
    anchor.appendChild(newDiv);
    newDiv.appendChild(await ophirofoxEuropresseLink());
}

onLoad().catch(console.error);
