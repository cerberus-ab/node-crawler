
'use strict';

const argv = Object.assign({
    limit: 20,
    output: 'result.json'
}, require('minimist')(process.argv.slice(2)));

const fs = require('fs');
const crawl = require('./src/crawl');
const { log } = require('./src/print');

crawl(argv.start, argv.limit).then(result => {
    log('Save the result in "' + argv.output + '"');
    fs.writeFile(argv.output, JSON.stringify(result), 'utf8', err => { 
        if (err) throw err;
    });
});