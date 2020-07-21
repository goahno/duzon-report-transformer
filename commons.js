String.prototype.removeWhitespaces = function () {
    return this.replace(/\s+/g, ' ');
}

export function createElementFromHtmlString(str) {
    const div = document.createElement('div');
    div.innerHTML = str.trim();
    return div.firstChild
}

export function getUrlParams() {
    const params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, (str, key, value) => {
        params[key] = value;
    });
    return params;
}

export function toPadString(number, length, pad) {
    return String(number).padStart(length, pad);
}

export function toNumber(src) {
    if (typeof src === 'number') {
        return src;
    }

    if (typeof src === 'string') {
        src = src.replace(/[^0-9-.]/g, '');
    }
    return Number(src);
}

export function stringWithCommas(x) {
    if (typeof x !== 'string') {
        x = x.toString();
    }
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
