// ----------------
// Functional code
// ----------------

export abstract class Game
{
    private previousElapsed: number;
    public ctx: CanvasRenderingContext2D;

    constructor() {}

    abstract init(): void;
    abstract load(): Promise<unknown>[];
    abstract update(delta: number): void;
    abstract render(): void;

    tick(elapsed: number)
    {
        // Clear previous frame:
        this.ctx.clearRect(0, 0, DISPLAY_SIZE_X, DISPLAY_SIZE_Y);
        // Compute delta time in seconds, also cap it:
        let delta = (elapsed - this.previousElapsed) / 1000.0;
        delta = Math.min(delta, 0.25);  // Maximum delta of 250 ms
        this.previousElapsed = elapsed;
        // Update and render:
        this.update(delta);
        this.render();
        // Create callback to next frame:
        window.requestAnimationFrame(this.tick.bind(this));
    }

    run(context: CanvasRenderingContext2D)
    {
        // Set object variables:
        this.ctx = context;
        this.previousElapsed = 0;
        // Define post load actions:
        let postLoad = function()
        {
            this.init();
            window.requestAnimationFrame(this.tick.bind(this));
        }.bind(this);
        // Load then start post load actions:
        Promise.all(this.load()).then(postLoad);
    }
}


// --------------------
// Data code
// --------------------

export const DISPLAY_SIZE_X = 1536;  // In pixels
export const DISPLAY_SIZE_Y = 768;  // In pixels