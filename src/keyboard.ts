// ----------------
// Functional code
// ----------------

let mousePos = [0, 0];
let keyboardObj = {};
let keys = {};
let mouse = false;

export function getMousePos(): number[]
{
    return mousePos;
}

export function setMousePos(newMousePos: number[])
{
    if (newMousePos.length != mousePos.length) { throw new Error('Invalid array size (is ' + newMousePos.length + ', has to be ' + mousePos.length + ')'); }
    mousePos = newMousePos;
}

export function onWheelScrolling(func: { (event: { preventDefault: () => void; deltaY: number; }): void; })
{
    window.addEventListener('wheel', func.bind(keyboardObj), { passive: false });
}

export function onMouseMove(func: { (event: { pageX: number; pageY: number; preventDefault: () => void; }): void; })
{
    window.addEventListener('mousemove', func.bind(keyboardObj), { passive: false });
}

export function listenForKeys(newKeys: number[])
{
    window.addEventListener('keydown', onKeyDown.bind(keyboardObj));
    window.addEventListener('keyup', onKeyUp.bind(keyboardObj));
    newKeys.forEach(function(key: number){ keys[key] = false; }.bind(keyboardObj));
}

export function listenForMouse()
{
    window.addEventListener('mousedown', function(){ mouse = true; }.bind(keyboardObj));
    window.addEventListener('mouseup', function(){ mouse = false; }.bind(keyboardObj));
}

export function isKeyDown(keyCode: number): boolean
{
    if ((keyCode in keys) == false) { throw new Error('Keycode ' + keyCode + ' is not being listened to'); }
    return keys[keyCode];
};

export function isMouseDown(): boolean
{
    return mouse;
};

function onKeyDown(event: { keyCode: number; preventDefault: () => void; })
{
    let keyCode = event.keyCode;
    if (keyCode in keys)
    {
        event.preventDefault();
        keys[keyCode] = true;
    }
};

function onKeyUp(event: { keyCode: number; preventDefault: () => void; })
{
    let keyCode = event.keyCode;
    if (keyCode in keys)
    {
        event.preventDefault();
        keys[keyCode] = false;
    }
};


// --------------------
// Data code
// --------------------

export const LEFT = 37;
export const RIGHT = 39;
export const UP = 38;
export const DOWN = 40;
export const SHIFT = 16;
export const W = 87;
export const A = 65;
export const S = 83;
export const D = 68;