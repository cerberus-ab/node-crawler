const uutil = require('./uutil');
const fetch = require('./fetch');
const extract = require('./extract');

/**
 * Crawls a website from start URL
 *
 * Provides collection with all fetched pages,
 * collection which describes internal links map,
 * total count of fetched pages and fin flag (limit reached).
 *
 * @param {string} start An absolute URL to start
 * @param {number} limit Optional limit of fetched pages, By default: 100
 * @return {Promise} The completable result
 */
function crawl(start, limit = 100) {
    let cache = {};
    let id = 0;  
    let carry = 0;
    let count = 0;
    let pages = [];
    let links = [];
    
    return new Promise((resolve, reject) => {
        !function curl(src, dst) {
            let dstHash = uutil.getHash(dst);
            // create a new page if is not presented yet
            if (dstHash in cache === false) {
                if (count + 1 > limit) {
                    return;
                }
                cache[dstHash] = ++id;
                let page = { id, url: dst };
                count++;
                carry++;
                
                fetch(dst)
                    .then(fetched => {
                        page.code = fetched.code;
                        extract(fetched, dst, start).forEach(ln => curl(dst, ln));
                    })
                    .catch(err => {
                        page.code = null;
                    })
                    .finally(() => {
                        pages.push(page);
                        if (--carry === 0) {
                            resolve({ 
                                pages: pages.sort((p1, p2) => p1.id - p2.id), 
                                links, 
                                count, 
                                fin: count < limit 
                            });
                        }
                    });
            }
            // save the link if is not root
            if (src !== null) {
                let srcHash = uutil.getHash(src);
                links.push({ from: cache[srcHash], to: cache[dstHash] });
            }
            
        }(null, start);
    });
}

module.exports = crawl;