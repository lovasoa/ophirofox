console.log('Ophirofox injected');

function extractKeywords() {
  return document
    .querySelector("meta[property='og:title']")
    .getAttribute("content");
}

async function createLink() {
  const a = await ophirofoxEuropresseLink(extractKeywords());
  return a;
}

function findPremiumBanner() {
  const anchor = document.querySelector('div.TypologyArticle__BlockPremium-sc-1vro4tp-2');
  if (!anchor) {
    return;
  }
  return anchor;
}

async function onLoad() {
  const premiumBanner = findPremiumBanner();
  if (!premiumBanner) return;

  /* 
    The UI is reactive (and DOM rewritten), so we need to wait for the banner to be added 
    to the DOM before we can add our link. It seems that it is a React component added to 
    the DOM in a particular order (last). Safe to use until it is not.
    Weird choices for a nearly-static content-driven website with SEO concerns.
  */
  const observer = new MutationObserver(async mutationsList => {
    for (let mutation of mutationsList) {
      if (mutation.addedNodes.length > 0) {
        const addedNode = mutation.addedNodes[0];

        /*
        <figure class="lead-art-wrapper">
          <div>
            <div class="dynamicClass1 dynamicClass2">
            ...
            </div>
          </div>
          ...
        </figure> is added dynamically.
        */

        if (addedNode && addedNode.parentElement && addedNode.parentElement.parentElement &&
          addedNode.parentElement.parentElement.nodeName === 'FIGURE') {
          const link = await createLink();
          if (link) {
            observer.disconnect();
            premiumBanner.after(link);
            break;
          } else {
            console.error('Ophirofox HTML anchor failed to create');
          }
        }
      }
    }
  });

  observer.observe(document.querySelector('#fusion-app'), { childList: true, subtree: true });
}

onLoad();