'use strict';

const url = require('url');
const cheerio = require('cheerio');

const uutil = require('./uutil');
const ft = require('./enum/ft');

function extractRaw(fetched) {
    switch (fetched.type) {
        // use cheerio for parsing the content for links
        case ft.OK:
            let $ = cheerio.load(fetched.content);
            return $('a[href]').toArray()
                .map(el => $(el).attr('href'))
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
        .filter(dst => /^https?\:\/\//i.test(dst))
        .filter(dst => uutil.inScope(dst, base));
}

module.exports = extract;