let buttonAdded = false;
function extractKeywords() {
  let currentURL = new URL(window.location)
  // get title at the end of URL pathname. 
  // Remove noise characters, and make it search-ready for europress
  const result = currentURL.pathname.split("/").pop().replace(/-|\.html$/g, ' ').trim()
  return  result;
}

async function createLink(title) {
  if (title && buttonAdded == false) {
    const div = document.createElement('div')
    const a = await ophirofoxEuropresseLink(extractKeywords());
    a.textContent = 'Lire sur europresse (Lexis Nexis)'
    div.appendChild(a);
    title.after(div)
  }
}

async function onLoad() {
  console.log("ophirofox loaded");

  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        for (let node of mutation.addedNodes) {

          const paywall = document.querySelector("#ctn_freemium_article");
          if (paywall == null) return;

          if (buttonAdded == false) {
            const article = document.querySelector(".a_s_b");
            createLink(article);

            const title = document.querySelector("h1");
            createLink(title);
          }
          buttonAdded = true;
          observer.disconnect();
        }
      }
    }
  };
  const htmlElement = document.querySelector("article");
  const observer = new MutationObserver(callback);
  observer.observe(htmlElement, { childList: true, subtree: true });
}
onLoad().catch(console.error);
