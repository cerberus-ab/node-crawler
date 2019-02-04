const uutil = require('./uutil');
const fetch = require('./fetch');
const extract = require('./extract');

function crawl(start, limit = 100) {
    let pages = {};
    let carry = 0;
    let count = 0;
    
    return new Promise((resolve, reject) => {
        !function curl(dst) {
            let hash = uutil.getHash(dst);

            if (hash in pages === false) {
                if (count + 1 > limit) {
                    return;
                }
                pages[hash] = { url: dst };
                count++;
                carry++;
                
                fetch(dst)
                    .then(fetched => {
                        pages[hash].code = fetched.code;
                        extract(fetched, dst, start).forEach(ln => curl(ln));
                    })
                    .catch(err => {
                        pages[hash].code = null;
                    })
                    .finally(() => {
                        if (--carry === 0) {
                            resolve({ pages, count, fin: count < limit });
                        }
                    });
            }
        }(start);
    });
}

module.exports = crawl;