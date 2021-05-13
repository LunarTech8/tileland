// --------------------
// Functional code
// --------------------

class TileMap
{
    private cols: number;
    private rows: number;
    public tiles: Array2D<Tile>;

    constructor(cols: number, rows: number)
    {
        this.cols = cols;
        this.rows = rows;
        // Generate tiles:
        this.tiles = new Array2D(this.cols, this.rows);
        let heightNoise = Random.generatePerlinNoise(this.cols, this.rows, Main.Settings.mapPerlinNoiseOctaves);
        let fertilityNoise = Random.generatePerlinNoise(this.cols, this.rows, Main.Settings.mapPerlinNoiseOctaves);
        for (let c = 0; c < this.cols; c++)
        {
            for (let r = 0; r < this.rows; r++)
            {
                this.tiles.set(c, r, new Tile(heightNoise.get(c, r), fertilityNoise.get(c, r), r / this.rows));
            }
        }
        // Determine cliffs:
        for (let c = 1; c < this.cols - 1; c++)
        {
            for (let r = 1; r < this.rows - 1; r++)
            {
                let t = this.tiles.get(c, r);
                if (t.Height > 0)
                {
                    let hasCliff = false;
                    if (Math.abs(t.Height - this.tiles.get(c - 1, r).Height) >= Main.Settings.cliffMinDiff) { hasCliff = true; }
                    else if (Math.abs(t.Height - this.tiles.get(c + 1, r).Height) >= Main.Settings.cliffMinDiff) { hasCliff = true; }
                    else if (Math.abs(t.Height - this.tiles.get(c, r - 1).Height) >= Main.Settings.cliffMinDiff) { hasCliff = true; }
                    else if (Math.abs(t.Height - this.tiles.get(c, r + 1).Height) >= Main.Settings.cliffMinDiff) { hasCliff = true; }
                    if (hasCliff)
                    {
                        t.Terrain = Tile.Terrain.CLIFF;
                        t.Vegetation = Tile.Vegetation.BARE;
                    }
                }
            }
        }
    }
}

class Camera
{
    public pos: number[];
    public zoom: number;
    public speed: number;

    constructor(pos: number[], zoom: number, speed: number)
    {
        this.pos = pos;
        this.zoom = zoom;
        this.speed = speed;
    }

    move(deltaX: number, deltaY: number)
    {
        // Move camera:
        this.pos[0] += this.speed * deltaX / this.zoom;
        this.pos[1] += this.speed * deltaY / this.zoom;
        // Clamp values:
        const tileSize = Math.round(Main.DEFAULT_TILE_SIZE * this.zoom);
        const halfWidth = Game.DISPLAY_SIZE_X / (2 * Main.Settings.mapTilesX * tileSize);
        const halfHeight = Game.DISPLAY_SIZE_Y / (2 * Main.Settings.mapTilesY * tileSize);
        this.pos[0] = Utilities.clip(this.pos[0], halfWidth, 1 - halfWidth);
        this.pos[1] = Utilities.clip(this.pos[1], halfHeight, 1 - halfHeight);
    }

    scale(delta: number)
    {
        const zoomMin = Math.max(Game.DISPLAY_SIZE_X / (Main.Settings.mapTilesX * Main.DEFAULT_TILE_SIZE), Game.DISPLAY_SIZE_Y / (Main.Settings.mapTilesY * Main.DEFAULT_TILE_SIZE), Main.CAMERA_ZOOM_MIN);
        this.zoom = Utilities.clip(this.zoom * Math.exp(delta * Main.CAMERA_ZOOM_SPEED), zoomMin, Main.CAMERA_ZOOM_MAX)
    }
}

class Main extends Game
{
    private static instance: Main;
    private map: TileMap;
    private camera: Camera;
    private settings: Settings;
    private tileAtlasTerrain: CanvasImageSource;
    private tileAtlasVegetation: CanvasImageSource;

    private constructor()
    {
        super();
    }

    public static get Instance()
    {
        return this.instance || (this.instance = new this());
    }

    public static get Settings()
    {
        return this.Instance.settings;
    }

    init()
    {
        this.tileAtlasTerrain = Loader.getImage('terrain');
        this.tileAtlasVegetation = Loader.getImage('vegetation');
        this.settings = new Settings(Settings.MapType.TEST, Settings.MapSize.TINY);
        this.map = new TileMap(this.settings.mapTilesX, this.settings.mapTilesY);
        this.camera = new Camera([0.5, 0.5], 1, Main.CAMERA_SPEED_NORMAL);
        Keyboard.listenForKeys([Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN, Keyboard.W, Keyboard.A, Keyboard.S, Keyboard.D, Keyboard.SHIFT]);
        Keyboard.listenForMouse();
        Keyboard.onWheelScrolling(function(event: { preventDefault: () => void; deltaY: number; })
        {
            event.preventDefault();
            if (event.deltaY != undefined)
            {
                this.camera.scale(-event.deltaY);
            }
        });
        Keyboard.onMouseMove(function(event: { pageX: any; pageY: any; preventDefault: () => void; })
        {
            let newMousePos = [event.pageX, event.pageY];
            let displayRect = this.ctx.canvas.getBoundingClientRect();
            if (Keyboard.isMouseDown() && Utilities.isInRect(Keyboard.mousePos, displayRect.left, displayRect.top, displayRect.right, displayRect.bottom))
            {
                event.preventDefault();
                this.camera.move(Main.CAMERA_DRAG_FACTOR * (Keyboard.mousePos[0] - newMousePos[0]), Main.CAMERA_DRAG_FACTOR * (Keyboard.mousePos[1] - newMousePos[1]));
            }
            Keyboard.mousePos = newMousePos;
        });
    };

    load()
    {
        return [Loader.loadImage('terrain', '../assets/terrain.png'), Loader.loadImage('vegetation', '../assets/vegetation.png')];
    };

    update(delta: number)
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
        if (Keyboard.isKeyDown(Keyboard.SHIFT)) { this.camera.speed = Main.CAMERA_SPEED_FAST; } else { this.camera.speed = Main.CAMERA_SPEED_NORMAL; }
        this.camera.move(dirX * delta, dirY * delta);
    };

    render()
    {
        // Draw map tiles:
        const tileSize = Math.round(Main.DEFAULT_TILE_SIZE * this.camera.zoom);
        const startCol = Math.floor(this.camera.pos[0] * this.settings.mapTilesX - (0.5 * Game.DISPLAY_SIZE_X / tileSize));
        const endCol = Math.ceil(this.camera.pos[0] * this.settings.mapTilesX + (0.5 * Game.DISPLAY_SIZE_X / tileSize));
        const offsetCol = this.camera.pos[0] * this.settings.mapTilesX - 0.5 * Game.DISPLAY_SIZE_X / tileSize;
        const startRow = Math.floor(this.camera.pos[1] * this.settings.mapTilesY - (0.5 * Game.DISPLAY_SIZE_Y / tileSize));
        const endRow = Math.ceil(this.camera.pos[1] * this.settings.mapTilesY + (0.5 * Game.DISPLAY_SIZE_Y / tileSize));
        const offsetRow = this.camera.pos[1] * this.settings.mapTilesY - 0.5 * Game.DISPLAY_SIZE_Y / tileSize;
        for (let c = startCol; c < endCol; c++)
        {
            for (let r = startRow; r < endRow; r++)
            {
                let displayX = Math.round((c - offsetCol) * tileSize);
                let displayY = Math.round((r - offsetRow) * tileSize);
                this.map.tiles.get(c, r).drawImages(this.ctx, displayX, displayY, tileSize, [this.tileAtlasTerrain, this.tileAtlasVegetation]);
            }
        }
    }
}


// --------------------
// Data code
// --------------------

namespace Main
{
    export const CAMERA_SPEED_NORMAL = 0.1;
    export const CAMERA_SPEED_FAST = CAMERA_SPEED_NORMAL * 3;
    export const CAMERA_DRAG_FACTOR = 0.001;
    export const CAMERA_ZOOM_MIN = 0.1;
    export const CAMERA_ZOOM_MAX = 4.0;
    export const CAMERA_ZOOM_SPEED = 0.05;
    export const DEFAULT_TILE_SIZE = 64;  // In pixels
}