'use strict';

const assert = require('assert');

const uutil = require('../src/uutil');

describe('URL utils specification', () => {
   
    describe('Function getHash', () => {
        it('should be defined in utils', () => {
            assert.ok(typeof uutil.getHash == 'function');
        });
        it('should return a hash by normalized url', () => {
            assert.strictEqual(uutil.getHash('http://www.example.com/index?page=1'), 'xR7ikvTLYq'); 
        });
        
        /**
         * The function relies on normalizeUrl,
         * so there are test cases only for modified settings.
         */
        let cases = [
            { src: 'http://www.example.com/#page/1', dst: 'http://www.example.com/#all', cond: true },
            { src: 'http://www.example.com/', dst: 'http://example.com/', cond: false },
            { src: 'http://www.example.com/path/', dst: 'http://www.example.com/path', cond: false }
        ];
        cases.forEach((tc, i) => {
            it(`case #${i + 1}: "${tc.src}" is ${!tc.cond ? 'NOT ' : ''}equal to "${tc.dst}"`, () => {
                assert.ok((uutil.getHash(tc.src) === uutil.getHash(tc.dst)) === tc.cond);
            });
        });
    });
    
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
    
});