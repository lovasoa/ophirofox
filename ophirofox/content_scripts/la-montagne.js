function extractKeywords() {
    return document.querySelector("h1")?.textContent;
}

async function injectButton() {
    if (document.querySelector('.ophirofox-europresse')) return;
    const reserved = document.querySelector(".typo-p2-paragraph p");
    if (!reserved || reserved.textContent.trim() !== "Article réservé aux abonnés") return;
    const a = await ophirofoxEuropresseLink(extractKeywords());
    a.classList.add("ophirofox-europresse", "btn", "relative", "btn-outline", "btn-primary", "btn-sm", "typo-caption-important", "self-start", "px-4", "py-1");
    reserved.closest(".typo-p2-paragraph").after(a);
}

const observer = new MutationObserver(() => injectButton().catch(console.error));
observer.observe(document.body, { childList: true, subtree: true });
injectButton().catch(console.error); 