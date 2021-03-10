// ----------------
// Functional code
// ----------------

var Keyboard = {};

Keyboard.LEFT = 37;
Keyboard.RIGHT = 39;
Keyboard.UP = 38;
Keyboard.DOWN = 40;
Keyboard.SHIFT = 16;
Keyboard.W = 87;
Keyboard.A = 65;
Keyboard.S = 83;
Keyboard.D = 68;
Keyboard._keys = {};

Keyboard.onScrolling = function(func)
{
    window.addEventListener('wheel', func.bind(this));
}

Keyboard.listenForKeys = function(keys)
{
    window.addEventListener('keydown', this._onKeyDown.bind(this));
    window.addEventListener('keyup', this._onKeyUp.bind(this));
    keys.forEach(function(key){ this._keys[key] = false; }.bind(this));
}

Keyboard.isDown = function(keyCode)
{
    if (!keyCode in this._keys)
    {
        throw new Error('Keycode ' + keyCode + ' is not being listened to');
    }
    return this._keys[keyCode];
};

Keyboard._onKeyDown = function(event)
{
    let keyCode = event.keyCode;
    if (keyCode in this._keys)
    {
        event.preventDefault();
        this._keys[keyCode] = true;
    }
};

Keyboard._onKeyUp = function(event)
{
    let keyCode = event.keyCode;
    if (keyCode in this._keys)
    {
        event.preventDefault();
        this._keys[keyCode] = false;
    }
};