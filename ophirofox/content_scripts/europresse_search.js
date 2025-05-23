async function consumeRequestType() {
    return new Promise((accept, reject) => {
        chrome.storage.local.get("ophirofox_request_type",
            (r) => {
                accept(r.ophirofox_request_type);
                chrome.storage.local.remove("ophirofox_request_type");
            });
    })
}

async function consumeReadRequest() {
    return new Promise((accept, reject) => {
        chrome.storage.local.get("ophirofox_read_request",
            (r) => {
                accept(r.ophirofox_read_request);
                chrome.storage.local.remove("ophirofox_read_request");
            });
    })
}

async function consumeReadPDFRequest() {
    return new Promise((accept, reject) => {
        chrome.storage.local.get("ophirofox_readPDF_request",
            (r) => {
                accept(r.ophirofox_readPDF_request);
                chrome.storage.local.remove("ophirofox_readPDF_request");
            });
    })
}

async function hasConsumable() {
    return new Promise((accept, reject) => {
        chrome.storage.local.get(
            ["ophirofox_request_type", "ophirofox_readPDF_request"],
            (result) => {
                // Vérifie si l'une des deux clés existe et contient une valeur
                const hasRequestType = result.ophirofox_request_type !== undefined;
                const hasReadPDFRequest = result.ophirofox_readPDF_request !== undefined;
                
                // Retourne true si au moins une des clés existe avec une valeur
                accept(hasRequestType || hasReadPDFRequest);
            }
        );
    });
}

async function loadRead(){
    const path = window.location.pathname;
    const { search_terms, published_time } = await consumeReadRequest();
    if (!search_terms) return;
    const stopwords = new Set(['d', 'l', 'et', 'sans', 'or']);

    /*
        L = { Lu , Ll , Lt , Lm , Lo }
        M = { Mn , Mc , Me }
        Nd: a decimal digit
        Unicode specification: https://www.unicode.org/reports/tr44/#General_Category_Values
        Categories browser: https://www.compart.com/fr/unicode/category
    */
    const keywords = search_terms
        .replace(/œ/g, 'oe')
        .split(/[^\p{L}\p{M}\p{Nd}]+/u)
        .filter(w => !stopwords.has(w))
        .join(' ');
    const keyword_field_id = path.startsWith("/Search/Result") ? "NativeQuery" : "Keywords";
    const keyword_field = document.getElementById(keyword_field_id);
    keyword_field.value = 'TIT_HEAD=' + keywords;

    // Looking for a time range
    const date_filter = document.getElementById("DateFilter_DateRange");

    if (date_filter) {
        if (!published_time) { // Full expand the time range
            date_filter.value = 9;
        } else {
            const publishedDate = new Date(published_time);
            publishedDate.setUTCHours(0, 0, 0, 0); // Europresse saves the exact UTC date, but "depuis X jours" is based on midnight 
            const currentDate = new Date();

            const timeDifference = currentDate.getTime() - publishedDate.getTime();
            // Rounds up for tolerance to be sure to not filtering badly
            const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

            let filterValue = 9;

            switch (true) {
                case (daysDifference <= 1):
                    filterValue = 2; // Depuis hier
                    break;
                case (daysDifference <= 3):
                    filterValue = 11; // Depuis 3 jours
                    break;
                case (daysDifference <= 7):
                    filterValue = 3; // Depuis 7 jours
                    break;
                case (daysDifference <= 30):
                    filterValue = 4; // Depuis 30 jours
                    break;
                case (daysDifference <= 90):
                    filterValue = 5; // Depuis 3 mois
                    break;
                case (daysDifference <= 180):
                    filterValue = 6; // Depuis 6 mois
                    break;
                case (daysDifference <= 365):
                    filterValue = 7; // Depuis 1 an
                    break;
                case (daysDifference <= 730):
                    filterValue = 8; // Depuis 2 ans
                    break;
                default:
                    filterValue = 9; // Dans toutes les archives
                    break;
            }

            date_filter.value = filterValue;
        }
    }
    keyword_field.form.submit();
}

async function loadReadPDF(){
    const { media_id, published_time } = await consumeReadPDFRequest();
    window.location = window.location.origin + `/PDF/EditionDate?sourceCode=${media_id}&singleDate=${published_time}&useFuzzyDate=false`;
}

async function onLoad() {
    ophirofoxRealoadOnExpired();
    const path = window.location.pathname;

    if (!(
        path.startsWith("/Search/Reading") ||
        path.startsWith("/Search/Advanced") ||
        path.startsWith("/Search/AdvancedMobile") ||
        path.startsWith("/Search/Express") ||
        path.startsWith("/Search/Simple") ||
        path.startsWith("/Search/Result") ||
        path.startsWith("/Search/ResultMobile") || 
        path === "/Pdf"
    )) return;

    if (!await hasConsumable()) {
        console.log("(Ophirofox) No consumable found.");
        if (path.startsWith("/Search/Result")) {
            const numberOfResul = document.querySelector('.resultOperations-count').textContent;
            if (numberOfResul === '1') {
                const auto_open_link = await getAutoOpenOption();
                if (auto_open_link) {

                    await readWhenOnlyOneResult();
                }
            } else if (numberOfResul === '0') {
                const query = document.querySelector('#Keywords');
                query.value = query.value.replace('TIT_HEAD=', 'TEXT=');
                const butonSearch = document.querySelector('#btnSearch');
                butonSearch.click();
            }
        }
        return;
    }

    // Fix une issue avec le proxy BNF qui redirige vers /Pdf
    if (path === '/Pdf') {
        window.location.pathname = '/Search/Reading';
        return;
    }

    const request = await consumeRequestType();
    if (request && request.type) {
        const { type } = request;
        console.log("request_type", type);
        if (type === "readPDF") {
            await loadReadPDF();
        } else {
            await loadRead();
        }
    } else {
        console.error("consumeRequestType() returned undefined or an object without a 'type' property.");
    }
}

function ophirofoxRealoadOnExpired() {
    const params = new URLSearchParams(window.location.search)
    if (params.get("ErrorCode") == "4000112") {
        // session expirée
        window.history.back();
    }
}

async function waitForElement(selector, callback, attempts = 0, maxAttempts = 10) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
        return true; // Indique que l'élément a été trouvé
    } else if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Attendre 0.5 seconde avant de réessayer
        return waitForElement(selector, callback, attempts + 1, maxAttempts);
    } else {
        console.error('Element not found after maximum attempts');
        return false; // Indique que l'élément n'a pas été trouvé
    }
}

function readWhenOnlyOneResult() {
    const observer = new MutationObserver(async () => {
        const found = await waitForElement('a.docList-links', (linkElement) => {
            console.log("linkElement", linkElement);
            linkElement.click();
        });
        if (found) {
            observer.disconnect(); // Arrêter l'observation une fois l'élément trouvé et cliqué
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

const DEFAULT_SETTINGS = {
    auto_open_link: false
};
const OPHIROFOX_SETTINGS_KEY = "ophirofox_settings";

async function getAutoOpenOption() {
    const key = OPHIROFOX_SETTINGS_KEY;
    return new Promise((accept) => {
        chrome.storage.local.get([key], function (result) {
            if (result.hasOwnProperty(key)) {
                current_settings = JSON.parse(result[key]);
                accept(current_settings.auto_open_link);
            }
            else accept(DEFAULT_SETTINGS.auto_open_link);
        });
    });
}

onLoad();
