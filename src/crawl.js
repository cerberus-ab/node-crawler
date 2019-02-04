const uutil = require('./uutil');
const fetch = require('./fetch');
const extract = require('./extract');

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
                            resolve({ pages, links, count, fin: count < limit });
                        }
                    });
            }
            // save the link if it is not root
            if (src !== null) {
                let srcHash = uutil.getHash(src);
                links.push({ from: cache[srcHash], to: cache[dstHash] });
            }
            
        }(null, start);
    });
}

module.exports = crawl;