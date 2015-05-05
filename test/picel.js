'use strict';

var assert = require('assert'),
    picel = require('../picel'),
    urlProvider = require('./fixtures/url.json'),
    filenameProvider = require('./fixtures/filename.json'),
    escapeProvider = require('./fixtures/escape.json'),
    dimensionProvider = require('./fixtures/dimension.json'),
    cropProvider = require('./fixtures/crop.json'),
    encodeProvider = require('./fixtures/encode.json');

it('should normalize urls', function() {
    urlProvider.forEach(function(params) {
        assert.equal(picel._normalizeUrl(params.input), params.expect);
    });
});

it('should compress hosts', function() {
    assert.equal(picel._compressHost('https://foo.com'), 's:foo.com');
    assert.equal(picel._compressHost('http://foo.com'), 'foo.com');
    assert.equal(picel._compressHost('foo.com'), 'foo.com');
});

it('should extract FileInfo', function() {
    filenameProvider.forEach(function(params) {
        assert.deepEqual(picel._extractFileInfo(params.filename), params.expect);
    });
});

it('should escape paths properly', function() {
    escapeProvider.forEach(function(params) {
        assert.equal(picel._escapePath(params.input), params.expect);
    });
});

it('should encode dimensions', function() {
    dimensionProvider.forEach(function(params) {
        assert.equal(picel._encodeDimension(params.width, params.height),
            params.expect, 'width: ' + params.width + ', height: ' + params.height);
    });
});

it('should encode crop params', function() {
    cropProvider.forEach(function(params) {
        assert.equal(picel._encodeCrop(params.x, params.y, params.width, params.height), params.expect);
    });
});

it('should encode JSON structs to urls (strings)', function() {
    encodeProvider.forEach(function(params) {
        assert.equal(picel.encode(params.input), params.expect);
    });
});
