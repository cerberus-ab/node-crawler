'use strict';

const uutil = require('./uutil');
const fetch = require('./fetch');
const extract = require('./extract');
const Result = require('./class/Result');
const { log } = require('./print');

/**
 * Crawls a website from start URL
 *
 * Provides collection with all fetched pages,
 * collection which describes internal links map,
 * total count of fetched pages and fin flag (limit reached).
 *
 * @param {string} start An absolute URL to start
 * @param {number} limit Optional limit of fetching pages, By default: 100
 * @return {Promise} The completable result
 */
function crawl(start, limit = 100) {
    let result = new Result(limit);
    let carry = 0;
    log('Start crawl "' + start + '" with limit ' + limit);
    
    return new Promise((resolve, reject) => {
        !function curl(src, dst) {
            let dstNorm = uutil.normalize(dst);
            // create a new page if is not passed yet
            if (!result.isPassed(dstNorm)) {
                if (result.isLimitReached()) {
                    return;
                }
                // init the page object
                let pid = result.initPage(dstNorm);
                
                carry++;
                log('Request (#' + pid + ') "' + dstNorm + '"');
                fetch(dstNorm)
                    .then(fetched => {
                        log('Fetched (#' + pid + ') "' + dstNorm + '" with code ' + fetched.code);
                        result.finPage(dstNorm, fetched.code);
                        extract(fetched, dstNorm, start).forEach(ln => curl(dstNorm, ln));
                    })
                    .catch(err => {
                        log('Fetched (#' + pid + ') "' + dstNorm + '" with error ' + err.message);
                        result.finPage(dstNorm, null);
                    })
                    .finally(() => {
                        // resolve the result on the last response
                        if (--carry === 0) {
                            log('Finish crawl "' + start + '" on count ' + result.count);
                            resolve(result.toResolve());
                        }
                    });
            }
            // save the link if is not root
            if (src !== null) {
                let srcNorm = uutil.normalize(src);
                result.addLink(srcNorm, dstNorm);
            }
        }(null, start);
    });
}

module.exports = crawl;