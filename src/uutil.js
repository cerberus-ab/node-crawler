'use strict';

const url = require('url');

function getLowerHost(dst) {
    return (new URL(dst)).hostname.toLowerCase();
}

function inScope(dst, base) {
    let dstHost = getLowerHost(dst);
    let baseHost = getLowerHost(base);
    let i = dstHost.indexOf(baseHost);
    // the same domain or has subdomains
    return i === 0 || dstHost[i - 1] === '.'; 
}

function normalize(dst) {
    let dstUrl = new URL(dst);
    // ignore userinfo (auth property)
    let origin = dstUrl.protocol + '//' + dstUrl.hostname;
    // ignore http(s) standart ports
    if (dstUrl.port && (!/^https?\:/i.test(dstUrl.protocol) || ![80, 8080, 443].includes(+dstUrl.port))) {
        origin += ':' + dstUrl.port;
    }
    // ignore fragment (hash property)
    let path = dstUrl.pathname + dstUrl.search;
    
    // convert origin to lower case
    return origin.toLowerCase() 
        // and capitalize letters in escape sequences
        + path.replace(/%([0-9a-f]{2})/ig, (_, es) => '%' + es.toUpperCase());
}

module.exports = { inScope, normalize };