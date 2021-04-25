// ----------------
// Functional code
// ----------------
var Loader = {};
Loader._images = {};
Loader.loadImage = function (key, src) {
    const img = new Image();
    const promise = new Promise(function (resolve, reject) {
        img.onload = function () {
            this._images[key] = img;
            resolve(img);
        }.bind(this);
        img.onerror = function () { reject('Could not load image: ' + src); };
    }.bind(this));
    img.src = src;
    return promise;
};
Loader.getImage = function (key) {
    return (key in this._images) ? this._images[key] : null;
};
