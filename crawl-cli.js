const crawl = require('./src/crawl');

// TODO: should be script parameters
const start = 'https://agilenihilist.org';
const limit = 20;

crawl(start, limit).then(result => console.log(result));