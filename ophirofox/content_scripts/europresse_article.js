function removeMarkElements() {
    // Remove all the <mark> elements, but keep their contents
    Array.from(document.querySelectorAll("article mark")).forEach(mark => {
        const repl = document.createElement("span");
        repl.className = "mark";
        Array.from(mark.childNodes).forEach(repl.appendChild.bind(repl));
        mark.parentNode.replaceChild(repl, mark);
    });
}

// Remove <mark> elements each time the page is updated 
let nextOp = null;
new MutationObserver(() => {
    if (nextOp) clearTimeout(nextOp);
    nextOp = setTimeout(removeMarkElements, 500);
}).observe(document.body, { subtree: true, childList: true });