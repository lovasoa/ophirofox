function extractKeywords() {
    return extractKeywordsFromTitle();
}

function extractArticleNumber(){
    let url = window.location.pathname;
    let parameters = url.split('/');
    return parameters[parameters.length - 1];
}

function extractKeywordsFromTitle() {
    const titleElem = document.getElementsByClassName("crayon article-titre-" + extractArticleNumber() + " h1")[0].innerHTML;
    return titleElem;
}

async function createLink() {
    const a = await ophirofoxEuropresseLink(extractKeywords());
    a.classList.add("btn", "btn--premium");
    return a;
}

async function onLoad() {
    const payArticle = document.querySelector('.promo_dispo_article');
    if (!payArticle) return;

    const actionElem = document.querySelector(".actions-article");
    if (!actionElem) return;
    actionElem.appendChild(await createLink());
}

onLoad().catch(console.error);