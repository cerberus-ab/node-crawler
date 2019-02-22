'use strict';

const url = require('url');
const normalizeUrl = require('normalize-url');

function inScope(dst, base) {
    return (new URL(dst).host.toLowerCase())
        .indexOf(new URL(base).host.toLowerCase()) !== -1;
}

function normalize(dst) {
    return normalizeUrl(dst, {
        stripHash: true,
        stripWWW: false,
        removeTrailingSlash: false
    });
}

module.exports = { inScope, normalize };