const url = require('url');
const crypto = require('crypto');

function getHash(dst) {
    return crypto.createHash('sha256')
        .update(dst.toLowerCase(), 'utf8')
        .digest('base64');
}

function inScope(dst, base) {
    return (new URL(base).host).indexOf(new URL(dst).host) !== -1;
}

module.exports = { getHash, inScope };