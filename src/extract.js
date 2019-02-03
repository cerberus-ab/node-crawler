const uutil = require('./uutil');
const ft = require('./enum/ft');

function select(fetched) {
    switch (fetched.type) {
        case ft.OK:
            // TODO: the parser for data is needed
            return [];
        case ft.REDIRECT:
            return [fetched.location];
        case ft.NO_DATA:
        default:
            return [];
    }
}

function extract(fetched, base) {
    return select(fetched).filter(dst => uutil.inScope(dst, base));
}

module.exports = extract;