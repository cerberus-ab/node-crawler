'use strict';

const url = require('url');
const crypto = require('crypto');
const normalizeUrl = require('normalize-url');

function normalize(dst) {
    return normalizeUrl(dst, {
        stripHash: true,
        stripWWW: false,
        removeTrailingSlash: false
    });
}

function getHash(dst) {
    return crypto.createHash('sha1')
        .update(normalize(dst), 'utf8')
        .digest('base64')
        .slice(0, 10);
}

function inScope(dst, base) {
    return (new URL(dst).host.toLowerCase())
        .indexOf(new URL(base).host.toLowerCase()) !== -1;
}

module.exports = { getHash, inScope };