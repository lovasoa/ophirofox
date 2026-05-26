function extractKeywords() {
  return document
    .querySelector("meta[property='og:title']")
    .getAttribute("content");
}

async function createLink(publishedTime) {
  const a = await ophirofoxEuropresseLink(extractKeywords(), { publishedTime: publishedTime });
  return a;
}

function findPremiumBanner() {
  return document.querySelector('div[class^=article-body-paywall]') || null;
}

function findInsertionPoint() {
  const target = 'Réservé aux abonnés'.normalize('NFC');
  const el = [...document.querySelectorAll('span')].find(
    s => s.textContent.normalize('NFC').trim() === target
  );
  return el?.parentElement ?? null;
}

async function injectLink(publishedDate) {
  if (document.querySelector('div[class^=article-body-paywall] + a.ophirofox-europresse')) return;
  const anchor = findInsertionPoint();
  if (!anchor) return;
  const link = await createLink(publishedDate);
  anchor.after(link);
  console.log('Ophirofox injected');
}

function resolvePublishedDate() {
  let publishedDate = document.querySelector(
    "meta[property='article:published_time'], meta[property='og:article:published_time'], meta[property='date:published_time']"
  )?.getAttribute("content") || '';

  const fusionMetadata = document.getElementById('fusion-metadata');
  if (fusionMetadata?.textContent) {
    const match = /"first_publish_date":"(\d{4}-\d{2}-\d{2}[A-Z]+\d{2}:\d{2}:\d{2}\.[0-9+-:]+Z)"/.exec(fusionMetadata.textContent);
    if (match) {
      const firstPublishedDateInstance = new Date(match[1]);
      if (!isNaN(firstPublishedDateInstance)) {
        if (!publishedDate.trim() || firstPublishedDateInstance < new Date(publishedDate)) {
          publishedDate = match[1];
        }
      }
    } else {
      console.error("No match for 'first_publish_date' found.");
    }
  } else {
    console.error("'fusion-metadata' element not found or empty.");
  }

  return publishedDate;
}

async function onLoad() {
  const observer = new MutationObserver(async mutationsList => {
    for (let mutation of mutationsList) {
      if (mutation.addedNodes.length > 0) {
        const addedNode = mutation.addedNodes[0];
        if (
          addedNode.classList.contains('dossier-feed') ||
          addedNode.classList.contains('article-body-paywall')
        ) {
          observer.disconnect();
          await injectLink(resolvePublishedDate());
          break;
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

(async () => {
  if (findPremiumBanner()) {
    await injectLink(resolvePublishedDate());
  }
  onLoad();
})();