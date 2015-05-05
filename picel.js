'use strict';

var picel = {};

picel.HTTP_SCHEMA = 'http://';
picel.HTTPS_SCHEMA = 'https://';
picel.FLAG_HTTPS_SCHEMA = 's:';
picel.DEFAULT_INPUT_EXTENSION = 'jpg';
picel.RAW = 'raw';

picel._normalizeUrl = function(raw) {
    var normalized = raw;

    if (normalized.charAt(normalized.length - 1) === '/') {
        normalized = normalized.substr(0, normalized.length - 1);
    }

    return normalized;
};

picel._compressHost = function(raw) {
    if (raw.indexOf(picel.HTTPS_SCHEMA) === 0) {
        return picel.FLAG_HTTPS_SCHEMA + raw.substr(picel.HTTPS_SCHEMA.length);
    }

    if (raw.indexOf(picel.HTTP_SCHEMA) === 0) {
        return raw.substr(picel.HTTP_SCHEMA.length);
    }

    return raw;
};

picel._escapePath = function(raw) {
    return raw.replace(/\_/g, '__');
};

picel._extractFileInfo = function(path) {
    var last;

    if (!path) {
        return {
            id: '',
            extension: picel.DEFAULT_INPUT_EXTENSION
        };
    }

    path = path.replace(/^\//, '');
    last = path.lastIndexOf('.');

    if (last === -1) {
        return {
            id: path.substr(0, path.length),
            extension: picel.DEFAULT_INPUT_EXTENSION
        };
    }

    return {
        id: path.substr(0, last),
        extension: path.substr(last + 1)
    };
};

picel._encodeParam = function (param) {
    return '_' + param;
};

picel._encodeCrop = function(x, y, width, height) {
    var crop = '';

    if (width && height) {
        crop = x + 'x' + y + ':' + width + 'x' + height;
    }

    return crop;
};

picel._encodeDimension = function(width, height) {
    var dim = '';

    if (!width && !height) {
        return dim;
    }

    if (!width) {
        width = '';
    }

    if (!height) {
        height = '';
    }

    dim = width + 'x' + height;

    return dim;
};

picel.encode = function (image) {
    var id,
        crop,
        fileInfo,
        url = '',
        params = [];

    if (image.prefix) {
        url = picel._normalizeUrl(image.prefix);
    }

    if (image.backend) {
        url += '/' + picel._normalizeUrl(picel._compressHost(image.backend));
    }

    fileInfo = picel._extractFileInfo(image.path);

    id = picel._normalizeUrl(picel._escapePath(fileInfo.id));

    if (id) {
        url += '/' + id;
    }

    if (image.raw) {
        url += '_' + picel.RAW + '.' + fileInfo.extension;
        return url;
    }

    if (image.crop) {
        crop = image.crop;
        params.push(picel._encodeCrop(crop.x, crop.y, crop.width, crop.height));
    }

    if (image.width || image.height) {
        params.push(picel._encodeDimension(image.width, image.height));
    }

    if (image.output !== fileInfo.extension &&
        (fileInfo.extension !== picel.DEFAULT_INPUT_EXTENSION || image.output)
        ) {
        params.push(picel._escapePath(fileInfo.extension));
    }

    params.forEach(function(param) {
        url += picel._encodeParam(param);
    });

    if (image.output) {
        url += '.' + picel._escapePath(image.output);
    }

    return url;
};

if (module && module.exports) {
    module.exports = picel;
}
