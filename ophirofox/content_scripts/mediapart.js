/**
 * @description create link <a> to a mirror
 * @param {string} AUTH_URL_MEDIAPART
 * @param {string} name
 */
async function createLink(AUTH_URL_MEDIAPART, name) {
  const span = document.createElement("span");
  span.textContent = "Lire avec " + name;

  const a = document.createElement("a");
  a.href = new URL(window.location);
  a.host = AUTH_URL_MEDIAPART;
  a.appendChild(span);
  return a;
}

async function createLinkBNF(AUTH_URL_MEDIAPART, name) {
  const span = document.createElement("span");
  span.textContent = "Lire avec " + name;
  const a = document.createElement("a");
  a.href = new URL(AUTH_URL_MEDIAPART);
  a.appendChild(span);
  return a;
}

/**
 * @description check DOM for article under paywall
 * @return {HTMLElement} DOM Premium Banner and head of the article
 */
function findPremiumBanner() {
  const article = document.querySelector(".news__body__center__container");
  if (!article) return null;
  const elems = article.querySelectorAll(".paywall-message");
  //labels not the same for mobile or PC display
  const textToFind = ["réservée aux abonné·es", "réservé aux abonné·es"];

  return [...elems].filter((balise) =>
    textToFind.some((text) => balise.textContent.toLowerCase().includes(text))
  );
}

/**
 * @description if not properly logged on the mirror website, fetch the login page
 */
async function handleMediapartMirror(config) {
  console.log('ophirofox handlemirror')
  const navBar = document.querySelector("ul.nav__actions");
  const spans = navBar.querySelectorAll("span");

  let isNotConnected = Array.from(spans).find(
    (elem) => elem.textContent == "Se connecter"
  );

  let articlePath ='';
  await chrome.storage.sync.get(['ophirofox_mediapart_article']).then((result) => {
  console.log('ophirofox storage',result.ophirofox_mediapart_article)
  articlePath = result.ophirofox_mediapart_article
});
  let currentPage = new URL(window.location)

  console.log('ophirofox notConnected: '+ isNotConnected)
  if (isNotConnected) {

    if (config.name == 'BNF') {
      console.log('ophirofox toujours pas connecté BNF')
    }else{
      //account name not found. fetch login page
      const LOGIN_PAGE = new URL(
        "licence",
        "http://" + config.AUTH_URL_MEDIAPART
      );
      fetch('https://www-mediapart-fr.bnf.idm.oclc.org/licence',{mode:'no-cors'}).then(() => window.location.reload());
    }
  }else if(config.name == 'BNF' && currentPage.pathname != articlePath){
    console.log('ophirofox window currentPage :',currentPage.origin)
    console.log('ophirofox articleURL path :',articlePath)
    window.location.pathname = articlePath
  }
}

async function handleMediapart(config) {
  const reserve = findPremiumBanner();
  if (!reserve) return;

  if (config.name == 'BNF') {
    chrome.storage.sync.set({
          "ophirofox_mediapart_article": new URL(window.location).pathname
        })
        chrome.storage.sync.get(['ophirofox_mediapart_article'], function(result) {
        console.log('ophirofox chrome.storage article: ' +result.ophirofox_mediapart_article );
      });
  } 

  for (const balise of reserve) {
    if(config.name == 'BNF'){
      balise.appendChild(await createLinkBNF('https://www-mediapart-fr.bnf.idm.oclc.org/licence', config.name));
    }else{
      balise.appendChild(await createLink(config.AUTH_URL_MEDIAPART, config.name));
    }
  }
}

/**@description check for users with mediapart access. If yes, create link button */
async function onLoad() {
  console.log('ophirofox ON LOAD ophi')
  const config = await configurationsSpecifiques(["BNF" , "Bibliotheque nationale et universitaire de Strasbourg"]);
  if (!config) return;
  console.log('ophirofox CONFIG specifique found',config)
  const currentPage = new URL(window.location);
  if (currentPage.host == config.AUTH_URL_MEDIAPART) {
    console.log('ophirofox handle mirror')
    handleMediapartMirror(config);
  } else {
     console.log('ophirofox handle normal')
    handleMediapart(config);
  }
}

onLoad().catch(console.error);