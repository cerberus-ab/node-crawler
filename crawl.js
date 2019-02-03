const fetch = require('./src/fetch');

// for test
fetch('https://agilenihilist.org')
    .then(console.log)
    .catch(console.log);