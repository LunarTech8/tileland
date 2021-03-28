// --------------------
// Data code
// --------------------

var Main = {};

Main.MAP_PERLIN_NOISE_OCTAVES = 6;
Main.MAP_TILES_X = 512;
Main.MAP_TILES_Y = 512;
Main.CAMERA_SPEED_NORMAL = 0.1;
Main.CAMERA_SPEED_FAST = Main.CAMERA_SPEED_NORMAL * 3;
Main.CAMERA_DRAG_FACTOR = 0.001;
Main.CAMERA_ZOOM_MIN = 0.1;
Main.CAMERA_ZOOM_MAX = 4.0;
Main.CAMERA_ZOOM_SPEED = 0.05;
Main.DEFAULT_TILE_SIZE = 64;  // In pixels


// --------------------
// Functional code
// --------------------

let map;
let camera;

class Map
{
    _cols;
    _rows;
    tiles;

    constructor(cols, rows)
    {
        this._cols = cols;
        this._rows = rows;
        // Generate tiles:
        this.tiles = new Array2D(this._cols, this._rows);
        let heightNoise = Random.generatePerlinNoise(this._cols, this._rows, Main.MAP_PERLIN_NOISE_OCTAVES);
        let fertilityNoise = Random.generatePerlinNoise(this._cols, this._rows, Main.MAP_PERLIN_NOISE_OCTAVES);
        for (let c = 0; c < this._cols; c++)
        {
            for (let r = 0; r < this._rows; r++)
            {
                this.tiles.set(c, r, new Tile(heightNoise.get(c, r), fertilityNoise.get(c, r), r / this._rows));
            }
        }
        // Determine cliffs:
        for (let c = 1; c < this._cols - 1; c++)
        {
            for (let r = 1; r < this._rows - 1; r++)
            {
                let t = this.tiles.get(c, r);
                if (t.height > 0)
                {
                    let hasCliff = false;
                    if (Math.abs(t.height - this.tiles.get(c - 1, r).height) >= Tile.CLIFF_MIN_DIFF) { hasCliff = true; }
                    else if (Math.abs(t.height - this.tiles.get(c + 1, r).height) >= Tile.CLIFF_MIN_DIFF) { hasCliff = true; }
                    else if (Math.abs(t.height - this.tiles.get(c, r - 1).height) >= Tile.CLIFF_MIN_DIFF) { hasCliff = true; }
                    else if (Math.abs(t.height - this.tiles.get(c, r + 1).height) >= Tile.CLIFF_MIN_DIFF) { hasCliff = true; }
                    if (hasCliff)
                    {
                        t.terrain = Tile.Terrain.CLIFF;
                        t.vegetation = Tile.Vegetation.BARE;
                    }
                }
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
        const tileSize = Math.round(Main.DEFAULT_TILE_SIZE * this.zoom);
        const halfWidth = Game.DISPLAY_SIZE_X / (2 * Main.MAP_TILES_X * tileSize);
        const halfHeight = Game.DISPLAY_SIZE_Y / (2 * Main.MAP_TILES_Y * tileSize);
        this.pos[0] = Utilities.clip(this.pos[0], halfWidth, 1 - halfWidth);
        this.pos[1] = Utilities.clip(this.pos[1], halfHeight, 1 - halfHeight);
    }

    scale(delta)
    {
        const zoomMin = Math.max(Game.DISPLAY_SIZE_X / (Main.MAP_TILES_X * Main.DEFAULT_TILE_SIZE), Game.DISPLAY_SIZE_Y / (Main.MAP_TILES_Y * Main.DEFAULT_TILE_SIZE), Main.CAMERA_ZOOM_MIN);
        this.zoom = Utilities.clip(this.zoom * Math.exp(delta * Main.CAMERA_ZOOM_SPEED), zoomMin, Main.CAMERA_ZOOM_MAX)
    }
}


// --------------------
// Overrides
// --------------------

Game.load = function()
{
    return [Loader.loadImage('terrain', '../assets/terrain.png'), Loader.loadImage('vegetation', '../assets/vegetation.png')];
};

Game.init = function()
{
    this.tileAtlasTerrain = Loader.getImage('terrain');
    this.tileAtlasVegetation = Loader.getImage('vegetation');
    map = new Map(Main.MAP_TILES_X, Main.MAP_TILES_Y);
    camera = new Camera([0.5, 0.5], 1, Main.CAMERA_SPEED_NORMAL);
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
        let displayRect = Game.ctx.canvas.getBoundingClientRect();
        if (Keyboard.isMouseDown() && Utilities.isInRect(Keyboard.mousePos, displayRect.left, displayRect.top, displayRect.right, displayRect.bottom))
        {
            event.preventDefault();
            camera.move(Main.CAMERA_DRAG_FACTOR * (Keyboard.mousePos[0] - newMousePos[0]), Main.CAMERA_DRAG_FACTOR * (Keyboard.mousePos[1] - newMousePos[1]));
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
    if (Keyboard.isKeyDown(Keyboard.SHIFT)) { camera.speed = Main.CAMERA_SPEED_FAST; } else { camera.speed = Main.CAMERA_SPEED_NORMAL; }
    camera.move(dirX * delta, dirY * delta);
};

Game.render = function()
{
    // Draw map tiles:
    const tileSize = Math.round(Main.DEFAULT_TILE_SIZE * camera.zoom);
    const startCol = Math.floor(camera.pos[0] * Main.MAP_TILES_X - (0.5 * Game.DISPLAY_SIZE_X / tileSize));
    const endCol = Math.ceil(camera.pos[0] * Main.MAP_TILES_X + (0.5 * Game.DISPLAY_SIZE_X / tileSize));
    const offsetCol = camera.pos[0] * Main.MAP_TILES_X - 0.5 * Game.DISPLAY_SIZE_X / tileSize;
    const startRow = Math.floor(camera.pos[1] * Main.MAP_TILES_Y - (0.5 * Game.DISPLAY_SIZE_Y / tileSize));
    const endRow = Math.ceil(camera.pos[1] * Main.MAP_TILES_Y + (0.5 * Game.DISPLAY_SIZE_Y / tileSize));
    const offsetRow = camera.pos[1] * Main.MAP_TILES_Y - 0.5 * Game.DISPLAY_SIZE_Y / tileSize;
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