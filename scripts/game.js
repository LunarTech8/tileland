// ----------------
// Functional code
// ----------------

var Game = {};

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
    this.ctx.clearRect(this.minX, this.minY, this.maxX, this.maxY);
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
    Game.run(document.getElementById('tiles').getContext('2d'));
};