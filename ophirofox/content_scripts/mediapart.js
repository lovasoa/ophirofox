/**
 * @description create link <a> to a mirror
 * @param {string} AUTH_URL_MEDIAPART
 * @param {string} name
 */
async function createLink(AUTH_URL_MEDIAPART, name) {
  const span = document.createElement("span");
  span.textContent = "Lire avec " + name;

  const a = document.createElement("a");
  a.href = new URL(
        "licence",
        "https://" + AUTH_URL_MEDIAPART
      );
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
  const navBar = document.querySelector("ul.nav__actions");
  const spans = navBar.querySelectorAll("span");

  let isNotConnected = Array.from(spans).find(
    (elem) => elem.textContent == "Se connecter"
  );

  let articlePath;
  await chrome.storage.sync.get(['ophirofox_mediapart_article']).then((result) => {
  articlePath = result.ophirofox_mediapart_article
  })

  let currentPage = new URL(window.location)
  let isRedirectArticle = articlePath && currentPage.pathname != articlePath
  if (isNotConnected) {
      console.error("ophirofox login failed")
      return
  }else if(isRedirectArticle){
    //redirect to mirror article
    window.location.pathname = articlePath
    //clear storage to enable futur navigation on the mirror
    chrome.storage.sync.remove(["ophirofox_mediapart_article"])
  }
}

async function handleMediapart(config) {
  const reserve = findPremiumBanner();
  if (!reserve) return;
  chrome.storage.sync.set({
        "ophirofox_mediapart_article": new URL(window.location).pathname
      })

  for (const balise of reserve) {
    balise.appendChild(await createLink(config.AUTH_URL_MEDIAPART, config.name));
  }
}

/**@description check for users with mediapart access. If yes, create link button */
async function onLoad() {
  const config = await configurationsSpecifiques(["BNF" , "Bibliotheque nationale et universitaire de Strasbourg"]);
  if (!config) return;
  const currentPage = new URL(window.location);
  if (currentPage.host == config.AUTH_URL_MEDIAPART) {
    handleMediapartMirror(config);
  } else {
    handleMediapart(config);
  }
}

onLoad().catch(console.error);