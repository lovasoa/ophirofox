const PAYWALL_TEXT = 'Réservé aux abonnés'.normalize('NFC');

function normalizeText(text) {
  return text.normalize('NFC').replace(/\u00A0/g, ' ').trim();
}

function extractKeywords() {
  return document
    .querySelector("meta[property='og:title']")
    .getAttribute("content");
}

async function createLink(publishedTime) {
  const a = await ophirofoxEuropresseLink(extractKeywords(), { publishedTime: publishedTime });
  return a;
}

function findInsertionPoint() {
  const el = [...document.querySelectorAll('span')].find(
    s => normalizeText(s.textContent) === PAYWALL_TEXT
  );
  return el?.parentElement ?? null;
}

let injected = false;

async function injectLink(publishedDate) {
  const anchor = findInsertionPoint();
  if (!anchor || injected) return;
  if (anchor.parentElement.querySelector('a.ophirofox-europresse')) return;
  injected = true;
  try {
    const link = await createLink(publishedDate);
    anchor.after(link);
    console.log('Ophirofox injected');
  } finally {
    injected = false;
  }
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

function onLoad() {
  const observer = new MutationObserver(async mutationsList => {
    for (let mutation of mutationsList) {
      for (const addedNode of mutation.addedNodes) {
        if (addedNode.nodeType !== Node.ELEMENT_NODE && addedNode.nodeType !== Node.TEXT_NODE) continue;
        if (normalizeText(addedNode.textContent).includes(PAYWALL_TEXT)) {
          await injectLink(resolvePublishedDate());
          return;
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

(async () => {
  onLoad();
  await injectLink(resolvePublishedDate());
})();
