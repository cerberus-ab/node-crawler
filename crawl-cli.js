
const argv = Object.assign({
    limit: 20 
}, require('minimist')(process.argv.slice(2)));

const crawl = require('./src/crawl');

crawl(argv.start, argv.limit).then(result => console.log(result));