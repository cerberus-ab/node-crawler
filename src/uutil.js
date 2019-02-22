'use strict';

const url = require('url');
const normalizeUrl = require('normalize-url');

function getHost(dst) {
    return (new URL(dst)).host.toLowerCase();
}

function inScope(dst, base) {
    let dstHost = getHost(dst);
    let baseHost = getHost(base);
    let i = dstHost.indexOf(baseHost);
    // the same domain or has subdomains
    return i === 0 || dstHost[i - 1] === '.'; 
}

function normalize(dst) {
    return normalizeUrl(dst, {
        stripHash: true,
        stripWWW: false
    });
}

module.exports = { inScope, normalize };