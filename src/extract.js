const url = require('url');
const { JSDOM } = require('jsdom');

const uutil = require('./uutil');
const ft = require('./enum/ft');

function extractRaw(fetched) {
    switch (fetched.type) {
        // use JSDOM for parsing the content for links
        case ft.OK:
            let document = new JSDOM(fetched.content).window.document;
            let elements = document.getElementsByTagName('A');
            return Array.from(elements)
                .map(el => el.getAttribute('href'))
                .filter(href => typeof href === 'string')
                .map(href => href.trim())
                .filter(Boolean);
        // use the location (from headers)
        case ft.REDIRECT:
            return [fetched.location];
        // nothing to select
        case ft.NO_DATA:
        default:
            return [];
    }
}

function extract(fetched, src, base) {
    return extractRaw(fetched)
        .map(href => url.resolve(src, href))
        .filter(dst => uutil.inScope(dst, base));
}

module.exports = extract;