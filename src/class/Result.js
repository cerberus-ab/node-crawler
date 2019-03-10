'use strict';

/**
 * The class works like a storage for collected data;
 * provides public API to increment and check the progress.
 *
 */
module.exports = class Result {
    constructor(limit = 0) {
        this._id = 0;
        this._urls = {};
        
        this.count = 0;
        this.limit = limit;
        // collections
        this.pages = [];
        this.links = [];
    }
    _nextId() {
        return ++this._id;
    }
    _findPage(url) {
        return this.pages.find(p => p.id === this._urls[url]);
    }
    // public API
    isPassed(url) {
        return url in this._urls;
    }
    isLimitReached() {
        return this.limit > 0 && this.count + 1 > this.limit;
    }
    initPage(url) {
        let newId = this._nextId();
        this._urls[url] = newId;
        this.count++;
        this.pages.push({ id: newId, url });
        return newId;
    }
    finPage(url, code) {
        Object.assign(this._findPage(url), { code });
    }
    addLink(src, dst) {
        this.links.push({ from: this._urls[src], to: this._urls[dst] });
    }
    toResolve() {
        return {
            pages: this.pages.sort((p1, p2) => p1.id - p2.id),
            links: this.links.sort((l1, l2) => l1.from - l2.from || l1.to - l2.to), 
            count: this.count, 
            fin: this.count < this.limit
        };
    }
}