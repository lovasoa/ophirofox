// Function to format date to "YYYY-MM-DD"
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Function to add days to a given date
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function onLoad() {
  // Get articles
  const articles = document.querySelectorAll('#liste-magazine-telerama article');
  
  for (const article of articles) {
    const linkElement = article.querySelector('a.popin-link');
    const tagName = linkElement.getAttribute('data-tagname');
    const datePattern = /clic_magazine_(\d{4}-\d{2}-\d{2})/;
    const match = tagName.match(datePattern);
    const articleDate = new Date(match[1]);
    // Check if the date object is valid
    if (isNaN(articleDate.getTime())) {
      console.error(`Invalid date: ${year}-${month + 1}-${day}`);
      return;
    }
    // Calculate the new date + 3 days
    const newDate = addDays(articleDate, 3);
    const formattedDate = formatDate(newDate);
    
    // Generate the link
    const a = await ophirofoxEuropressePDFLink("TA_P",formattedDate);
    a.classList.add("btn", "btn--premium");
    
    // Inject the link into the article
    article.appendChild(a);
  }
}

onLoad().catch(console.error);
