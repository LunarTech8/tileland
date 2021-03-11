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
const CAMERA_ZOOM_MIN = 0.1;
const CAMERA_ZOOM_MAX = 10.0;
const CAMERA_ZOOM_SPEED = 0.1;


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
    zoom = 1.0;

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

let map;
let camera;

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
    this.tileAtlas = Loader.getImage('tiles');
    map = new Map(MAP_TILES_X, MAP_TILES_Y);
    camera = new Camera(map, this.maxX, this.maxY);
    Keyboard.listenForKeys([Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN, Keyboard.W, Keyboard.A, Keyboard.S, Keyboard.D, Keyboard.SHIFT]);
    Keyboard.onScrolling(function(event)
    {
        event.preventDefault();
        if (event.deltaY != undefined)
        {
            camera.zoom = Math.min(Math.max(camera.zoom * Math.exp(event.deltaY * CAMERA_ZOOM_SPEED), CAMERA_ZOOM_MIN), CAMERA_ZOOM_MAX);
            // TODO: also use camera.zoom to scale distance between scaled tiles
        }
    });
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
    if (Keyboard.isDown(Keyboard.SHIFT)) { camera.speed = CAMERA_SPEED_FAST; } else { camera.speed = CAMERA_SPEED_NORMAL; }
    camera.move(delta, dirX, dirY);
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
    let startCol = Math.floor(camera.x / TILE_SIZE);
    let endCol = startCol + (camera.width / TILE_SIZE);
    let startRow = Math.floor(camera.y / TILE_SIZE);
    let endRow = startRow + (camera.height / TILE_SIZE);
    let offsetX = -camera.x + startCol * TILE_SIZE;
    let offsetY = -camera.y + startRow * TILE_SIZE;
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
                    TILE_SIZE * camera.zoom, // target width
                    TILE_SIZE * camera.zoom // target height
                );
            }
        }
    }
};