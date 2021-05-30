import { Main } from "./main";


// ----------------
// Functional code
// ----------------

window.onload = function()
{
    const canvas = document.getElementById('tileland') as HTMLCanvasElement;
    Main.Instance.run(canvas.getContext('2d'));
};