'use strict';

const assert = require('assert');

const uutil = require('../src/uutil');

describe('URL utils specification', () => {
   
    describe('Function inScope', () => {
        it('should be defined in utils', () => {
            assert.ok(typeof uutil.inScope == 'function');
        });
        it('should return a boolean by the condition', () => {
            assert.ok(typeof uutil.inScope('http://www.example.com', 'http://example.com') === 'boolean'); 
        });
        
        let cases = [
            { src: 'http://example.com/', dst: 'https://example.com', cond: true },
            { src: 'httl://example.com:3000', dst: 'http://example.com/', cond: true },
            { src: 'http://example.com:80/', dst: 'https://example.com:443/', cond: true },
            { src: 'https://example.com/', dst: 'http://www.example.com/', cond: true },
            { src: 'http://example.com/', dst: 'http://admin.example.com/', cond: true },
            { src: 'http://example.com/', dst: 'http://test.www.example.com/', cond: true },
            { src: 'http://example.com/', dst: 'http://example2.com/', cond: false },
            { src: 'http://example.com/', dst: 'http://example.org/', cond: false },
            { src: 'http://www.example.com/', dst: 'http://blog.example.com/', cond: false },
            { src: 'http://example.com/', dst: 'http://wwwexample.com/', cond: false }
        ];
        cases.forEach((tc, i) => {
            it(`case #${i + 1}: "${tc.dst}" is ${!tc.cond ? 'NOT ' : ''}in scope "${tc.src}"`, () => {
                assert.ok((uutil.inScope(tc.dst, tc.src)) === tc.cond);
            });
        });
    });
    
    describe('Function normalize', () => {
        it('should be defined in utils', () => {
            assert.ok(typeof uutil.normalize == 'function');
        });
        
        let cases = [
            { dst: 'HTTP://EXAMPLE.COM/index.html', dstNorm: 'http://example.com/index.html' },
            { dst: 'http://example.com', dstNorm: 'http://example.com/' },
            { dst: 'http://user:pass@example.com/', dstNorm: 'http://example.com/' },
            { dst: 'http://example.com:80/', dstNorm: 'http://example.com/' },
            { dst: 'http://example.com:3000/', dstNorm: 'http://example.com:3000/' },
            { dst: 'http://www.example.com/', dstNorm: 'http://www.example.com/' },
            { dst: 'http://example.com/?page=1#top', dstNorm: 'http://example.com/?page=1' },
            { dst: 'http://example.com/a%c2%b1b', dstNorm: 'http://example.com/a%C2%B1b' }
        ];
        cases.forEach((tc, i) => {
            it(`case #${i + 1}: "${tc.dst}" cast to "${tc.dstNorm}"`, () => {
                assert.strictEqual(uutil.normalize(tc.dst), tc.dstNorm);
            });
        });
    });
    
});