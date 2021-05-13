// ----------------
// Functional code
// ----------------

abstract class Game
{
    private previousElapsed: number;
    public ctx: CanvasRenderingContext2D;

    constructor()
    {
        this.init();
    }

    abstract init(): void;
    abstract load(): Promise<unknown>[];
    abstract update(delta: number): void;
    abstract render(): void;

    run(context: CanvasRenderingContext2D)
    {
        this.ctx = context;
        this.previousElapsed = 0;
        Promise.all(this.load()).then(function()
        {
            this.init();
            window.requestAnimationFrame(this.tick);
        }.bind(this));
    }

    tick(elapsed: number)
    {
        window.requestAnimationFrame(this.tick);
        // Clear previous frame:
        this.ctx.clearRect(0, 0, Game.DISPLAY_SIZE_X, Game.DISPLAY_SIZE_Y);
        // Compute delta time in seconds, also cap it:
        let delta = (elapsed - this.previousElapsed) / 1000.0;
        delta = Math.min(delta, 0.25);  // Maximum delta of 250 ms
        this.previousElapsed = elapsed;
        // Update and render:
        this.update(delta);
        this.render();
    }
}


// --------------------
// Data code
// --------------------

namespace Game
{
    export const DISPLAY_SIZE_X = 1536;  // In pixels
    export const DISPLAY_SIZE_Y = 768;  // In pixels
}


// ----------------
// Startup
// ----------------

window.onload = function()
{
    const canvas = document.getElementById('tileland') as HTMLCanvasElement;
    Main.Instance.run(canvas.getContext('2d'));
};