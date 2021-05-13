// ----------------
// Functional code
// ----------------

namespace Loader
{
    let images = {};

    export function loadImage(key: string, src: string): Promise<unknown>
    {
        const img = new Image();
        const promise = new Promise(function (resolve: (arg0: HTMLImageElement) => void, reject: (arg0: string) => void)
        {
            img.onload = function()
            {
                images[key] = img;
                resolve(img);
            }.bind(this);

            img.onerror = function() {reject('Could not load image: ' + src);};
        }.bind(this));
        img.src = src;
        return promise;
    }

    export function getImage(key: string): CanvasImageSource
    {
        return (key in images) ? images[key] : null;
    }
}