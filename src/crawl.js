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
                pages[hash] = { url: dst };
                count += 1;
                carry += 1;
                
                fetch(dst)
                    .then(fetched => {
                        pages[hash].code = fetched.code;
                        let links = extract(fetched, dst, start);
                        let remain = limit - count;
                        
                        if (links.length && remain > 0) {
                            links.slice(0, remain).forEach(ln => curl(ln));
                        }
                    })
                    .catch(err => {
                        pages[hash].code = null;
                    })
                    .finally(() => {
                        carry -= 1;
                        if (carry === 0) {
                            resolve({ pages, count, fin: count < limit });
                        }
                    });
            }
        }(start);
    });
}

module.exports = crawl;