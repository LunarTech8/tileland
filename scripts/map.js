// --------------------
// Data code
// --------------------

const MAP_PERLIN_NOISE_OCTAVES = 6;
const MAP_TILES_X = 512;
const MAP_TILES_Y = 512;
const CAMERA_SPEED_NORMAL = 0.1;
const CAMERA_SPEED_FAST = CAMERA_SPEED_NORMAL * 3;
const CAMERA_DRAG_FACTOR = 0.001;
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
    pos;
    zoom
    speed;

    constructor(pos, zoom, speed)
    {
        this.pos = pos;
        this.zoom = zoom;
        this.speed = speed;
    }

    move(deltaX, deltaY)
    {
        // Move camera:
        this.pos[0] += this.speed * deltaX / this.zoom;
        this.pos[1] += this.speed * deltaY / this.zoom;
        // Clamp values:
        const tileSize = Math.round(DEFAULT_TILE_SIZE * this.zoom);
        const halfWidth = DISPLAY_SIZE_X / (2 * MAP_TILES_X * tileSize);
        const halfHeight = DISPLAY_SIZE_Y / (2 * MAP_TILES_Y * tileSize);
        this.pos[0] = Utilities.clip(this.pos[0], halfWidth, 1 - halfWidth);
        this.pos[1] = Utilities.clip(this.pos[1], halfHeight, 1 - halfHeight);
    }

    scale(delta)
    {
        const zoomMin = Math.max(DISPLAY_SIZE_X / (MAP_TILES_X * DEFAULT_TILE_SIZE), DISPLAY_SIZE_Y / (MAP_TILES_Y * DEFAULT_TILE_SIZE), CAMERA_ZOOM_MIN);
        this.zoom = Utilities.clip(this.zoom * Math.exp(delta * CAMERA_ZOOM_SPEED), zoomMin, CAMERA_ZOOM_MAX)
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
    camera = new Camera([0.5, 0.5], 1, CAMERA_SPEED_NORMAL);
    Keyboard.listenForKeys([Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN, Keyboard.W, Keyboard.A, Keyboard.S, Keyboard.D, Keyboard.SHIFT]);
    Keyboard.listenForMouse();
    Keyboard.onWheelScrolling(function(event)
    {
        event.preventDefault();
        if (event.deltaY != undefined)
        {
            camera.scale(-event.deltaY);
        }
    });
    Keyboard.onMouseMove(function(event)
    {
        let newMousePos = [event.pageX, event.pageY];
        if (Keyboard.isMouseDown())
        {
            event.preventDefault();
            camera.move(CAMERA_DRAG_FACTOR * (Keyboard.mousePos[0] - newMousePos[0]), CAMERA_DRAG_FACTOR * (Keyboard.mousePos[1] - newMousePos[1]));
        }
        Keyboard.mousePos = newMousePos;
    });
};

Game.update = function(delta)
{
    let dirX = 0;
    let dirY = 0;
    // Handle camera movement with keys:
    if (Keyboard.isKeyDown(Keyboard.LEFT)) { dirX = -1; }
    if (Keyboard.isKeyDown(Keyboard.RIGHT)) { dirX = 1; }
    if (Keyboard.isKeyDown(Keyboard.UP)) { dirY = -1; }
    if (Keyboard.isKeyDown(Keyboard.DOWN)) { dirY = 1; }
    if (Keyboard.isKeyDown(Keyboard.A)) { dirX = -1; }
    if (Keyboard.isKeyDown(Keyboard.D)) { dirX = 1; }
    if (Keyboard.isKeyDown(Keyboard.W)) { dirY = -1; }
    if (Keyboard.isKeyDown(Keyboard.S)) { dirY = 1; }
    if (Keyboard.isKeyDown(Keyboard.SHIFT)) { camera.speed = CAMERA_SPEED_FAST; } else { camera.speed = CAMERA_SPEED_NORMAL; }
    camera.move(dirX * delta, dirY * delta);
};

Game.render = function()
{
    // Draw map tiles:
    const tileSize = Math.round(DEFAULT_TILE_SIZE * camera.zoom);
    const startCol = Math.floor(camera.pos[0] * MAP_TILES_X - (0.5 * DISPLAY_SIZE_X / tileSize));
    const endCol = Math.ceil(camera.pos[0] * MAP_TILES_X + (0.5 * DISPLAY_SIZE_X / tileSize));
    const offsetCol = camera.pos[0] * MAP_TILES_X - 0.5 * DISPLAY_SIZE_X / tileSize;
    const startRow = Math.floor(camera.pos[1] * MAP_TILES_Y - (0.5 * DISPLAY_SIZE_Y / tileSize));
    const endRow = Math.ceil(camera.pos[1] * MAP_TILES_Y + (0.5 * DISPLAY_SIZE_Y / tileSize));
    const offsetRow = camera.pos[1] * MAP_TILES_Y - 0.5 * DISPLAY_SIZE_Y / tileSize;
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