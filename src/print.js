function log(message) {
    process.stdout.write('[' + (new Date).toISOString() + '] ' + message + '\n');
}

module.exports = { log };