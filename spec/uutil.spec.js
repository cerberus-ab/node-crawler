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
            { src: 'http://example.com/', dst: 'http://www.example.com/', cond: true },
            { src: 'http://example.com/', dst: 'https://admin.example.com/', cond: true },
            { src: 'https://example.com/', dst: 'http://test.www.example.com/', cond: true },
            { src: 'http://example.com/', dst: 'http://example2.com/', cond: false },
            { src: 'http://example.com/', dst: 'http://example.org/', cond: false },
            { src: 'http://www.example.com/', dst: 'http://blog.example.com/', cond: false }
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
        
        /**
         * The function relies on normalizeUrl,
         * so there are test cases only for modified settings.
         */
        let cases = [
            { dst: 'http://example.com/#page/1', dstNorm: 'http://example.com' },
            { dst: 'http://www.example.com/', dstNorm: 'http://www.example.com' }
        ];
        cases.forEach((tc, i) => {
            it(`case #${i + 1}: "${tc.dst}" cast to "${tc.dstNorm}"`, () => {
                assert.strictEqual(uutil.normalize(tc.dst), tc.dstNorm);
            });
        });
    });
    
});