// --------------------
// Data code
// --------------------

const MAP_PERLIN_NOISE_OCTAVES = 5;
const MAP_TILES_X = 256;
const MAP_TILES_Y = 256;
const CAMERA_SPEED_NORMAL = 0.1;
const CAMERA_SPEED_FAST = CAMERA_SPEED_NORMAL * 3;
const CAMERA_ZOOM_MIN = 0.1;
const CAMERA_ZOOM_MAX = 4.0;
const CAMERA_ZOOM_SPEED = 0.05;
const DEFAULT_TILE_SIZE = 64;  // In pixels


// --------------------
// Prototypes
// --------------------

class Map
{
    cols;
    rows;
    tiles;

    constructor(cols, rows)
    {
        this.cols = cols;
        this.rows = rows;
        this.tiles = new Array2D(this.cols, this.rows);
        let heightNoise = Random.generatePerlinNoise(this.cols, this.rows, MAP_PERLIN_NOISE_OCTAVES);
        let fertilityNoise = Random.generatePerlinNoise(this.cols, this.rows, MAP_PERLIN_NOISE_OCTAVES);
        for (let c = 0; c < this.cols; c++)
        {
            for (let r = 0; r < this.rows; r++)
            {
                this.tiles.set(c, r, new Tile(heightNoise.get(c, r), fertilityNoise.get(c, r), r / this.rows));
            }
        }
    }
}

class Camera
{
    x;
    y;
    zoom
    speed;

    constructor(x, y, zoom, speed)
    {
        this.x = x;
        this.y = y;
        this.zoom = zoom;
        this.speed = speed;
    }

    move(delta, dirX, dirY)
    {
        // Move camera:
        this.x += dirX * this.speed * delta / this.zoom;
        this.y += dirY * this.speed * delta / this.zoom;
        // Clamp values:
        const tileSize = Math.round(DEFAULT_TILE_SIZE * this.zoom);
        const halfWidth = DISPLAY_SIZE_X / (2 * MAP_TILES_X * tileSize);
        const halfHeight = DISPLAY_SIZE_Y / (2 * MAP_TILES_Y * tileSize);
        this.x = Math.max(halfWidth, Math.min(this.x, 1 - halfWidth));
        this.y = Math.max(halfHeight, Math.min(this.y, 1 - halfHeight));
    }

    scale(delta)
    {
        const zoomMin = Math.max(DISPLAY_SIZE_X / (MAP_TILES_X * DEFAULT_TILE_SIZE), DISPLAY_SIZE_Y / (MAP_TILES_Y * DEFAULT_TILE_SIZE), CAMERA_ZOOM_MIN);
        this.zoom = Math.min(Math.max(this.zoom * Math.exp(delta * CAMERA_ZOOM_SPEED), zoomMin), CAMERA_ZOOM_MAX);
    }
}


// --------------------
// Functional code
// --------------------

let map;
let camera;

Game.load = function()
{
    return [Loader.loadImage('terrain', '../assets/terrain.png'), Loader.loadImage('vegetation', '../assets/vegetation.png')];
};

Game.init = function()
{
    this.tileAtlasTerrain = Loader.getImage('terrain');
    this.tileAtlasVegetation = Loader.getImage('vegetation');
    map = new Map(MAP_TILES_X, MAP_TILES_Y);
    camera = new Camera(0.5, 0.5, 1, CAMERA_SPEED_NORMAL);
    Keyboard.listenForKeys([Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN, Keyboard.W, Keyboard.A, Keyboard.S, Keyboard.D, Keyboard.SHIFT]);
    Keyboard.onScrolling(function(event)
    {
        event.preventDefault();
        if (event.deltaY != undefined)
        {
            camera.scale(-event.deltaY);
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
    this._drawLayers();
};

Game._drawLayers = function()
{
    const tileSize = Math.round(DEFAULT_TILE_SIZE * camera.zoom);
    const startCol = Math.floor(camera.x * MAP_TILES_X - (0.5 * DISPLAY_SIZE_X / tileSize));
    const endCol = Math.ceil(camera.x * MAP_TILES_X + (0.5 * DISPLAY_SIZE_X / tileSize));
    const offsetCol = camera.x * MAP_TILES_X - 0.5 * DISPLAY_SIZE_X / tileSize;
    const startRow = Math.floor(camera.y * MAP_TILES_Y - (0.5 * DISPLAY_SIZE_Y / tileSize));
    const endRow = Math.ceil(camera.y * MAP_TILES_Y + (0.5 * DISPLAY_SIZE_Y / tileSize));
    const offsetRow = camera.y * MAP_TILES_Y - 0.5 * DISPLAY_SIZE_Y / tileSize;
    for (let c = startCol; c < endCol; c++)
    {
        for (let r = startRow; r < endRow; r++)
        {
            let displayX = Math.round((c - offsetCol) * tileSize);
            let displayY = Math.round((r - offsetRow) * tileSize);
            map.tiles.get(c, r).drawImages(this.ctx, displayX, displayY, tileSize, [this.tileAtlasTerrain, this.tileAtlasVegetation]);
        }
    }
};