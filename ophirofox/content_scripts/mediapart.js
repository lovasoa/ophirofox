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
function handleMediapartMirror(config) {
  const navBar = document.querySelector("ul.nav__actions");
  const spans = navBar.querySelectorAll("span");

  let isNotConnected = Array.from(spans).find(
    (elem) => elem.textContent == "Se connecter"
  );
  if (isNotConnected) {
    //account name not found. fetch login page
    const LOGIN_PAGE = new URL(
      "licence",
      "https://" + config.AUTH_URL_MEDIAPART
    );
    fetch(LOGIN_PAGE).then(() => window.location.reload());
  }
}

async function handleMediapart(config) {
  const reserve = findPremiumBanner();
  if (!reserve) return;

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