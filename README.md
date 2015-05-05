# picel-js [![Build Status](http://img.shields.io/travis/henvic/picel-js/master.svg?style=flat)](https://travis-ci.org/henvic/picel-js) [![NPM version](http://img.shields.io/npm/v/picel.svg?style=flat)](http://npmjs.org/picel) [![NPM downloads](http://img.shields.io/bower/v/picel.svg?style=flat)](http://npmjs.org/picel)

JavaScript library for string-encoding images to be served using the [picel](https://github.com/henvic/picel) image processing service microservice / middleware.

Learn more about Picel by reading the [project docs](https://github.com/henvic/picel#readme).

## Install
Install via [Bower](http://bower.io/), [npm](https://www.npmjs.com/) or clone the repo.

This encoder library works both with Node.JS and on browsers.

## API
**picel.encode(image)**

Image is a JSON that can contain any of the following keys:
* prefix: picel end-point
* backend: image storage end-point (only when picel server is open / unrestricted)
* path: path to the file relative to the backend server
* raw: boolean flag to retrieve the original file
* crop: {x, y, width, height}
* width
* height
* output

All methods inside the price object that starts with **_** (underscore) are to be considered private and you should not rely on them. The only reason it's not scoped inside of a closure is to facilitate testing (but that may change on the future).

## Examples
It's pretty easy to compose image transformation urls using this library.

Let's start with
```
var img = {
    prefix: "http://localhost:8123/",
    path: "7386/11274440243_10456d457d_h.jpg"
};
```

From there we will extend the img object and invoke the picel.encode successively.


```
picel.encode(img);
```
returns
`http://localhost:8123/7386/11274440243__10456d457d__h`

Which won't work unless you're using a single backend. If you aren't, you've to extend the img object:

```
img.backend = "https://farm8.staticflickr.com/";

picel.encode(img);
```
returns
`http://localhost:8123/s:farm8.staticflickr.com/7386/11274440243__10456d457d__h`

If you want to crop:
```
img.crop = {
    x: 0,
    y: 10,
    width: 600,
    height: 600
};

picel.encode(img);
```
will return

`http://localhost:8123/s:farm8.staticflickr.com/7386/11274440243__10456d457d__h_0x10:600x600`

and so on.

By omitting the extension the server will serve you the more appropriate extension.

If you want to force an extension just use `img.output = 'jpg'`, for example.

For example:
```
picel.encode({
    "path": "/foo.gif",
    "width": 600,
    "height": 400,
    "output": "webp"
})
```
should return `/foo_600x400_gif.webp`


More examples can be recovered from the [picel-js/test/fixtures/encode.json](https://github.com/henvic/picel-js/blob/master/test/fixtures/encode.json) test data provider file.
