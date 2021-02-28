// --------------------
// Data code
// --------------------

const TILE_ID_TERRAIN_MIN = 1;
const TILE_ID_TERRAIN_MAX = 3;
const TILE_ID_VEGETATION_MIN = 4;
const TILE_ID_VEGETATION_MAX = 6;
const MAP_SIZE_X = 16;  // In tiles
const MAP_SIZE_Y = 16;  // In tiles
const TILE_SIZE = 64;  // In pixels


// --------------------
// Prototypes
// --------------------

class Map
{
    rows;
    cols;
    layers;  // Terrain, vegetation

    constructor(rows, cols)
    {
        this.rows = rows;
        this.cols = cols;
        this.layers = [this.createRandomLayer(TILE_ID_TERRAIN_MIN, TILE_ID_TERRAIN_MAX), this.createRandomLayer(TILE_ID_VEGETATION_MIN, TILE_ID_VEGETATION_MAX)];
    }

    getTile(layer, col, row)
    {
        return this.layers[layer][row * this.cols + col];
    }

    createRandomLayer(minTileId, maxTileId)
    {
        let layer = [];
        for (var c = 0; c <= this.cols; c++)
        {
            for (var r = 0; r <= this.rows; r++)
            {
                layer[r * this.cols + c] = Utilities.getRandomInt(minTileId, maxTileId);
            }
        }
        return layer;
    }
}

function Camera(map, width, height)
{
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.maxX = map.cols * TILE_SIZE - width;
    this.maxY = map.rows * TILE_SIZE - height;
}

Camera.prototype.move = function(delta, dirx, diry)
{
    // Move camera:
    this.x += dirx * Camera.SPEED * delta;
    this.y += diry * Camera.SPEED * delta;
    // Clamp values:
    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));
};


// --------------------
// Functional code
// --------------------

let map = new Map(MAP_SIZE_X, MAP_SIZE_Y);
Camera.SPEED = 256; // Pixels per second

Game.load = function()
{
    return [Loader.loadImage('tiles', '../assets/tiles.png')];
};

Game.init = function()
{
    Keyboard.listenForEvents([Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN]);
    this.tileAtlas = Loader.getImage('tiles');
    this.camera = new Camera(map, 512, 512);
};

Game.update = function(delta)
{
    // Handle camera movement with arrow keys:
    var dirx = 0;
    var diry = 0;
    if (Keyboard.isDown(Keyboard.LEFT)) { dirx = -1; }
    if (Keyboard.isDown(Keyboard.RIGHT)) { dirx = 1; }
    if (Keyboard.isDown(Keyboard.UP)) { diry = -1; }
    if (Keyboard.isDown(Keyboard.DOWN)) { diry = 1; }

    this.camera.move(delta, dirx, diry);
};

Game._drawLayer = function(layer)
{
    var startCol = Math.floor(this.camera.x / TILE_SIZE);
    var endCol = startCol + (this.camera.width / TILE_SIZE);
    var startRow = Math.floor(this.camera.y / TILE_SIZE);
    var endRow = startRow + (this.camera.height / TILE_SIZE);
    var offsetX = -this.camera.x + startCol * TILE_SIZE;
    var offsetY = -this.camera.y + startRow * TILE_SIZE;

    for (var c = startCol; c <= endCol; c++)
    {
        for (var r = startRow; r <= endRow; r++)
        {
            var tile = map.getTile(layer, c, r);
            var x = (c - startCol) * TILE_SIZE + offsetX;
            var y = (r - startRow) * TILE_SIZE + offsetY;
            if (tile !== 0)
            {
                this.ctx.drawImage
                (
                    this.tileAtlas, // image
                    (tile - 1) * TILE_SIZE, // source x
                    0, // source y
                    TILE_SIZE, // source width
                    TILE_SIZE, // source height
                    Math.round(x),  // target x
                    Math.round(y), // target y
                    TILE_SIZE, // target width
                    TILE_SIZE // target height
                );
            }
        }
    }
};

Game.render = function()
{
    // Draw map background layer:
    this._drawLayer(0);
    // Draw map top layer:
    this._drawLayer(1);
};