'use strict';

const assert = require('assert');
const { JSDOM } = require('jsdom');

const ft = require('../src/enum/ft');
const extract = require('../src/extract');

function createContent(hrefs) {
    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="utf-8">
            </head>
            <body>
                ${hrefs.map((ln, i) => `<a href="${ln}" > dst ${i + 1}</a>`).join('')}
            </body>
        </html>
    `;
}

describe('Links extractor specification', () => {
    let src = 'https://www.example.com/index.html';
    let base = 'https://example.com';
    
    describe('Extract from OK', () => {
        let fetched = {
            type: ft.OK,
            code: 200,
            content: createContent([
                'page/1',
                'http://example.com/page/2',
                'https://example.com/page/3'
            ])
        };
        let links = extract(fetched, src, base);
        it('should return an array with extracted links', () => {
            assert.ok(links instanceof Array);
            assert.strictEqual(links.length, 3);
        });
        it('should return the links as absolute urls', () => {
            links.forEach(ln => assert.ok(/^\w+\:\/\//.test(ln)));
        });
        
        // test cases for variable hrefs
        let cases = [
            { msg: 'should extract absolute url in scope', href: 'https://admin.example.com/', dst: 'https://admin.example.com/' },
            { msg: 'should extract relative url', href: '/blog/1', dst: 'https://www.example.com/blog/1' },
            { msg: 'should ignore absolute url out of scope', href: 'https://example2.com/' , dst: null },
            { msg: 'should ignore empty url (trimmed)', href: ' \t', dst: null },
            { msg: 'should ignore not http(s) url', href: 'ftp://example.com/file', dst: null },
            { msg: 'should ignore malformed url', href: 'file://%20AA', dst: null }
        ];
        cases.forEach((tc, i) => {
            let fetched = {
                type: ft.OK,
                code: 200,
                content: createContent([tc.href])
            };
            let links = extract(fetched, src, base);
            
            it(`case #${i + 1}: ${tc.msg}`, () => {
                if (tc.dst) {
                    assert.strictEqual(links.length, 1);
                    assert.strictEqual(links[0], tc.dst);
                } else {
                    assert.strictEqual(links.length, 0);
                }
            });
        });
    });
    
    describe('Extract from REDIRECT', () => {
        let fetched = {
            type: ft.REDIRECT,
            code: 301,
            location: '/main.html'
        };
        let links = extract(fetched, src, base);
        
        it('should return an array with the location', () => {
            assert.ok(links instanceof Array);
            assert.strictEqual(links.length, 1);
            assert.strictEqual(links[0], 'https://www.example.com/main.html');
        });
    });
    
    describe('Extract from NO_DATA', () => {
        let fetched = {
            type: ft.NO_DATA,
            code: 404
        };
        let links = extract(fetched, src, base);
        
        it('should return an empty array', () => {
            assert.ok(links instanceof Array);
            assert.strictEqual(links.length, 0);
        });
    });
    
});