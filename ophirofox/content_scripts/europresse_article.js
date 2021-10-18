function removeMarkElements() {
    // Remove all the <mark> elements, but keep their contents
    Array.from(document.querySelectorAll("article mark")).forEach(mark => {
        const repl = document.createElement("span");
        repl.className = "mark";
        Array.from(mark.childNodes).forEach(repl.appendChild.bind(repl));
        mark.parentNode.replaceChild(repl, mark);
    });

}
setTimeout(removeMarkElements, 3 * 1000);