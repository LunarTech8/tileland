// --------------------
// Data code
// --------------------

const TILE_ID_TERRAIN_MIN = 1;
const TILE_ID_TERRAIN_MAX = 3;
const TILE_ID_VEGETATION_MIN = 4;
const TILE_ID_VEGETATION_MAX = 6;
const MAP_TILES_X = 128;  // In tiles
const MAP_TILES_Y = 128;  // In tiles
const TILE_SIZE = 64;  // In pixels
const MAP_SIZE_X = 1536;  // Display size in pixels
const MAP_SIZE_Y = 768;  // Display size in pixels
const MAP_PERLIN_NOISE_OCTAVES = 5;
const CAMERA_SPEED_NORMAL = 512;  // Pixels per second
const CAMERA_SPEED_FAST = CAMERA_SPEED_NORMAL * 3;  // Pixels per second


// --------------------
// Prototypes
// --------------------

class Map
{
    cols;
    rows;
    layers;  // Terrain, vegetation

    constructor(cols, rows)
    {
        this.cols = cols;
        this.rows = rows;
        this.layers = [this.createRandomLayer(TILE_ID_TERRAIN_MIN, TILE_ID_TERRAIN_MAX), this.createRandomLayer(TILE_ID_VEGETATION_MIN, TILE_ID_VEGETATION_MAX)];
    }

    getTile(layer, col, row)
    {
        return this.layers[layer][row * this.cols + col];
    }

    createRandomLayer(minTileId, maxTileId)
    {
        let perlinNoise = Random.generatePerlinNoise(this.rows, this.cols, MAP_PERLIN_NOISE_OCTAVES);
        let layer = [];
        for (let c = 0; c < this.cols; c++)
        {
            for (let r = 0; r < this.rows; r++)
            {
                layer[r * this.cols + c] = Utilities.scaleToInt(perlinNoise.get(r, c), minTileId, maxTileId);
            }
        }
        return layer;
    }
}

class Camera
{
    speed = CAMERA_SPEED_NORMAL;

    constructor(map, width, height)
    {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.maxX = map.cols * TILE_SIZE - width;
        this.maxY = map.rows * TILE_SIZE - height;
    }

    move(delta, dirX, dirY)
    {
        // Move camera:
        this.x += dirX * this.speed * delta;
        this.y += dirY * this.speed * delta;
        // Clamp values:
        this.x = Math.max(0, Math.min(this.x, this.maxX));
        this.y = Math.max(0, Math.min(this.y, this.maxY));
    }
}


// --------------------
// Functional code
// --------------------

let map = new Map(MAP_TILES_X, MAP_TILES_Y);

Game.load = function()
{
    return [Loader.loadImage('tiles', '../assets/tiles.png')];
};

Game.init = function()
{
    this.minX = 0;
    this.minY = 0;
    this.maxX = MAP_SIZE_X;
    this.maxY = MAP_SIZE_Y;
    Keyboard.listenForKeys([Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN, Keyboard.W, Keyboard.A, Keyboard.S, Keyboard.D, Keyboard.SHIFT]);
    Keyboard.onScrolling(function(event)
    {
        event.preventDefault();  // FIXME: check how to prevent browser scrolling
        console.info(event.deltaY);  // DEBUG: use event.deltaY value to zoom in/out
    });
    this.tileAtlas = Loader.getImage('tiles');
    this.camera = new Camera(map, this.maxX, this.maxY);
};

Game.update = function(delta)
{
    let dirX = 0;
    let dirY = 0;
    // Handle camera movement with keys:
    if (Keyboard.isDown(Keyboard.LEFT)) { dirX = -1; }
    if (Keyboard.isDown(Keyboard.RIGHT)) { dirX = 1; }
    if (Keyboard.isDown(Keyboard.UP)) { dirY = -1; }
    if (Keyboard.isDown(Keyboard.DOWN)) { dirY = 1; }
    if (Keyboard.isDown(Keyboard.A)) { dirX = -1; }
    if (Keyboard.isDown(Keyboard.D)) { dirX = 1; }
    if (Keyboard.isDown(Keyboard.W)) { dirY = -1; }
    if (Keyboard.isDown(Keyboard.S)) { dirY = 1; }
    if (Keyboard.isDown(Keyboard.SHIFT)) { this.camera.speed = CAMERA_SPEED_FAST; } else { this.camera.speed = CAMERA_SPEED_NORMAL; }
    this.camera.move(delta, dirX, dirY);
};

Game.render = function()
{
    // Draw map background layer:
    this._drawLayer(0);
    // Draw map top layer:
    this._drawLayer(1);
};

Game._drawLayer = function(layer)
{
    let startCol = Math.floor(this.camera.x / TILE_SIZE);
    let endCol = startCol + (this.camera.width / TILE_SIZE);
    let startRow = Math.floor(this.camera.y / TILE_SIZE);
    let endRow = startRow + (this.camera.height / TILE_SIZE);
    let offsetX = -this.camera.x + startCol * TILE_SIZE;
    let offsetY = -this.camera.y + startRow * TILE_SIZE;
    for (let c = startCol; c <= endCol; c++)
    {
        for (let r = startRow; r <= endRow; r++)
        {
            let tile = map.getTile(layer, c, r);
            let x = (c - startCol) * TILE_SIZE + offsetX;
            let y = (r - startRow) * TILE_SIZE + offsetY;
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