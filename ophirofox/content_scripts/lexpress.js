function findPremiumBanner() {
    const banner = document.querySelector('.article__premium--icon');
    return banner;
}

async function onLoad() {
    const banner = findPremiumBanner();
    if (!banner) {
        // No premium banner found, hide the page action
        chrome.runtime.sendMessage({premiumContent: false});
        return;
    }
    
    // Premium banner found, show the page action
    chrome.runtime.sendMessage({premiumContent: true});
    
    // Continue with your existing implementation
    const anchor = document.querySelector('.article__icons');
    const newDiv = document.createElement('div');
    newDiv.classList.add('europresse-button');
    anchor.appendChild(newDiv);
    
    // Get the current page title for keywords
    const keywords = document.querySelector("h1")?.textContent || "";
    
    // Get published time
    const publishedTimeMetaTag = document.querySelector("meta[property='article:published_time'], meta[property='og:article:published_time'], meta[property='date:published_time']");
    let publishedTime = publishedTimeMetaTag?.getAttribute("content") || '';
    let publishedTimeFormatted = '';
    
    if (publishedTime) {
        let publishedTimeInstance = new Date(publishedTime);
        if (!isNaN(publishedTimeInstance)) {
            publishedTimeFormatted = publishedTimeInstance.toISOString().slice(0, 10);
        }
    }
    
    // Send this data to the background script
    chrome.runtime.sendMessage({
        europresseData: {
            keywords: keywords.trim(),
            publishedTime: publishedTimeFormatted
        }
    });
    
    // Add the original link as before
    const linkElement = await ophirofoxEuropresseLink();
    newDiv.appendChild(linkElement);
}

onLoad().catch(console.error);