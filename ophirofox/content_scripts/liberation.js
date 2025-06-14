function extractKeywords() {
  return document
    .querySelector("meta[property='og:title']")
    .getAttribute("content");
}

/**
 * Crée un lien vers Europresse avec les keywords donnés
 * @param {string} publishedTime - article publication date (2024-01-01)
 * @returns {Promise<HTMLAnchorElement>}
 */
async function createLink(publishedTime) {
  const a = await ophirofoxEuropresseLink(extractKeywords(), { publishedTime: publishedTime });
  return a;
}

function findPremiumBanner() {
  const anchor = document.querySelector('div.TypologyArticle__BlockPremium-sc-1vro4tp-2 , div.jahSgQ');
  if (!anchor) {
    return;
  }
  return anchor;
}

async function onLoad(premiumBanner) {
  if (premiumBanner) {
    /*
      The UI is reactive (and DOM rewritten), so we need to wait for some nodes to be rewritten to the DOM
      before we can add our link. It seems that the React components are added to the DOM in a particular order.

      With heavy loading, the MutationObserver execution is too late, and only catch .dossier-feed class.
      After caching, we can rely on the .article-body-paywall added node.

      Weird choices for a nearly-static content-driven website with SEO concerns.
    */
    const observer = new MutationObserver(async mutationsList => {
      for (let mutation of mutationsList) {
        if (mutation.addedNodes.length > 0) {
          const addedNode = mutation.addedNodes[0];
          if (addedNode.classList.contains('dossier-feed') ||
            addedNode.classList.contains('article-body-paywall')
          ) {
            observer.disconnect();

            // Not sure if premiumBanner is (and will be) still valid after DOM rewrite
            if (!document.querySelector('div.TypologyArticle__BlockPremium-sc-1vro4tp-2 + a.ophirofox-europresse')) {
              // See #239, Libération replaces date:published_time with the date of edit, which means that a search limited by the time of publication may be too restrictive
              // We need to specify the date to use for the generic ophirofoxEuropresseLink function
              // Might need refactor if other medias have the same problem, more properties for fail-safe
              let publishedDate = document.querySelector("meta[property='article:published_time'], meta[property='og:article:published_time'], meta[property='date:published_time']")?.getAttribute("content") || '';

              let firstPublishedDate = null;
              let firstPublishedDateInstance = null;

              let fusionMetadata = document.getElementById('fusion-metadata');
              if (fusionMetadata && fusionMetadata.textContent) {
                let match = /"first_publish_date":"(\d{4}-\d{2}-\d{2}[A-Z]+\d{2}:\d{2}:\d{2}\.[0-9+-:]+Z)"/.exec(fusionMetadata.textContent); // 2024-08-27T18:18:55.663Z => UTC
                if (match) {
                  firstPublishedDate = match[1];
                  firstPublishedDateInstance = new Date(firstPublishedDate);
                } else {
                  console.error("No match for 'first_publish_date' found.");
                }
              } else {
                console.error("'fusion-metadata' element not found or empty.");
              }

              // Check if publishedDate exists and is not empty
              if (publishedDate && publishedDate.trim()) {
                // If the first published date is valid and older
                if (firstPublishedDateInstance && !isNaN(firstPublishedDateInstance) && (firstPublishedDateInstance < new Date(publishedDate))) {
                  publishedDate = firstPublishedDate;
                }
              } else {
                // If published date is empty or invalid, use firstPublishedDate if available
                if (firstPublishedDateInstance && !isNaN(firstPublishedDateInstance)) {
                  publishedDate = firstPublishedDate;
                }
              }

              findPremiumBanner().after(await createLink(publishedDate));
              console.log('Ophirofox injected after React DOM rewrite');
              break;
            }
          }
        }
      }
    });
    observer.observe(document.querySelector('#fusion-app'), { childList: true, subtree: true });
  }
}

// Edge-cases, it costs nothing to try to add it *à l'ancienne*
createLink().then(link => {
  const premiumBanner = findPremiumBanner();
  if (premiumBanner) {
    premiumBanner.after(link);
    console.log('Ophirofox injected');
  }
  onLoad(premiumBanner);
});
