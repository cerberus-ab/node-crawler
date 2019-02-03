const fetch = require('./src/fetch');
const uutil = require('./src/uutil');

// TODO: should be script parameters
const start = 'https://agilenihilist.org';
const limit = 20;


function crawl(start, limit = 100) {
    let pages = {};
    let carry = 0;
    let count = 0;
    
    return new Promise((resolve, reject) => {
        !function curl(dst) {
            count += 1;
            carry += 1;
            let hash = uutil.getHash(dst);

            if (hash in pages === false) {
                pages[hash] = { url: dst };
                fetch(dst)
                    .then(result => {
                        pages[hash].code = result.code;
                        // TODO: extract new links for curl
                    
                    })
                    .catch(err => {
                        pages[hash].code = null;
                    })
                    .finally(() => {
                        carry -= 1;
                        if (carry === 0 || count === limit) {
                            resolve({ pages, count, fin: count < limit });
                        }
                    });
            }
        }(start);
    });
}

crawl(start, limit).then(result => console.log(result));