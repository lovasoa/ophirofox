async function consumeReadRequest() {
    return new Promise((accept, reject) => {
        chrome.storage.local.get("ophirofox_read_request",
            (r) => {
                accept(r.ophirofox_read_request);
                chrome.storage.local.remove("ophirofox_read_request");
            });
    })
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
        path.startsWith("/Search/Result")
    )) return;
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

function ophirofoxRealoadOnExpired() {
    const params = new URLSearchParams(window.location.search)
    if (params.get("ErrorCode") == "4000112") {
        // session expirée
        window.history.back();
    }
}

onLoad();