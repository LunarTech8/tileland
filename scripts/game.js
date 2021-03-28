// --------------------
// Data code
// --------------------

var Game = {};

Game.DISPLAY_SIZE_X = 1536;  // In pixels
Game.DISPLAY_SIZE_Y = 768;  // In pixels


// ----------------
// Functional code
// ----------------

Game.run = function(context)
{
    this.ctx = context;
    this._previousElapsed = 0;
    Promise.all(this.load()).then(function(loaded)
    {
        this.init();
        window.requestAnimationFrame(this.tick);
    }.bind(this));
};

Game.tick = function(elapsed)
{
    window.requestAnimationFrame(this.tick);
    // Clear previous frame:
    this.ctx.clearRect(0, 0, Game.DISPLAY_SIZE_X, Game.DISPLAY_SIZE_Y);
    // Compute delta time in seconds, also cap it:
    let delta = (elapsed - this._previousElapsed) / 1000.0;
    delta = Math.min(delta, 0.25);  // Maximum delta of 250 ms
    this._previousElapsed = elapsed;
    // Update and render:
    this.update(delta);
    this.render();
}.bind(Game);

// Override these methods:
Game.init = function() {};
Game.update = function(delta) {};
Game.render = function() {};


// ----------------
// Startup
// ----------------

window.onload = function()
{
    Game.run(document.getElementById('tileland').getContext('2d'));
};