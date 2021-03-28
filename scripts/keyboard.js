// --------------------
// Data code
// --------------------

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


// ----------------
// Functional code
// ----------------

Keyboard.mousePos = [0, 0];
Keyboard._keys = {};
Keyboard._mouse = false;

Keyboard.onWheelScrolling = function(func)
{
    window.addEventListener('wheel', func.bind(this), { passive: false });
}

Keyboard.onMouseMove = function(func)
{
    window.addEventListener('mousemove', func.bind(this), { passive: false });
}

Keyboard.listenForKeys = function(keys)
{
    window.addEventListener('keydown', this._onKeyDown.bind(this));
    window.addEventListener('keyup', this._onKeyUp.bind(this));
    keys.forEach(function(key){ this._keys[key] = false; }.bind(this));
}

Keyboard.listenForMouse = function()
{
    window.addEventListener('mousedown', function(){ this._mouse = true; }.bind(this));
    window.addEventListener('mouseup', function(){ this._mouse = false; }.bind(this));
}

Keyboard.isKeyDown = function(keyCode)
{
    if (!keyCode in this._keys)
    {
        throw new Error('Keycode ' + keyCode + ' is not being listened to');
    }
    return this._keys[keyCode];
};

Keyboard.isMouseDown = function()
{
    return this._mouse;
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