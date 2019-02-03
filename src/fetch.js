const url = require('url');

const clients = Object.freeze({
    'http:': require('http'),
    'https:': require('https')
});

const ft = require('./enum/ft');

/**
 * Fetches an URL and returns a Promise
 * which provides a result object in depending on the response:
 * 
 * OK - code (2xx), data
 * REDIRECT - code (3xx), location
 * NO_DATA (others) - code
 * 
 * @param {string} urlStr Target URL as a string
 * @return {Promise} The completable result
 */
function fetch(urlStr) {
    return new Promise((resolve, reject) => {
        let urlObj = url.parse(urlStr);
        let client = clients[urlObj.protocol];
        if (!client) {
            reject(new Error('Could not select a client for: ' + urlObj.protocol));
        }
        // send the request and resolve the result
        let req = client.get(urlObj.href, res => {
            let result = { code: res.statusCode };
            let codeGroup = Math.floor(res.statusCode / 100);
            // OK
            if (codeGroup === 2) {
                let body = [];
                res.setEncoding('utf8');
                res.on('data', chunk => body.push(chunk));
                res.on('end', () => resolve(Object.assign(result, { data: body.join(''), type: ft.OK })));
            }
            // REDIRECT
            else if (codeGroup === 3 && res.headers.location) {
                resolve(Object.assign(result, { location: res.headers.location, type: ft.REDIRECT }));
            }
            // NO_DATA (others)
            else {
                resolve(Object.assign(result, { type: ft.NO_DATA }));
            }
        });
        req.on('error', err => reject(err));
        req.end();
    });
}

module.exports = fetch;