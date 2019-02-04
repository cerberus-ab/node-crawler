const uutil = require('./uutil');
const fetch = require('./fetch');
const extract = require('./extract');

function crawl(start, limit = 100) {
    let cache = {};
    let id = 0;
    
    let carry = 0;
    let count = 0;
    
    let pages = [];
    
    return new Promise((resolve, reject) => {
        !function curl(dst) {
            let hash = uutil.getHash(dst);

            if (hash in cache === false) {
                if (count + 1 > limit) {
                    return;
                }
                cache[hash] = ++id;
                let page = { id, url: dst };
                count++;
                carry++;
                
                fetch(dst)
                    .then(fetched => {
                        page.code = fetched.code;
                        extract(fetched, dst, start).forEach(ln => curl(ln));
                    })
                    .catch(err => {
                        page.code = null;
                    })
                    .finally(() => {
                        pages.push(page);
                        if (--carry === 0) {
                            resolve({ pages, count, fin: count < limit });
                        }
                    });
            }
        }(start);
    });
}

module.exports = crawl;