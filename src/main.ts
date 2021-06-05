import { Array2D } from "./array2D.js";
import { Tile, determineCliff } from "./tile.js";
import * as MSettings from "./settings.js";
import * as MRandom from "./random.js";
import * as MGame from "./game.js";
import * as MKeyboard from "./keyboard.js";
import * as MLoader from "./loader.js";
import * as MUtilities from "./utilities.js";


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
        let heightNoise = MRandom.generatePerlinNoise(this.cols, this.rows, Main.Settings.mapPerlinNoiseOctaves);
        let fertilityNoise = MRandom.generatePerlinNoise(this.cols, this.rows, Main.Settings.mapPerlinNoiseOctaves);
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
                if (t.height > 0)
                {
                    t.cliffs[0] = determineCliff(Math.abs(t.height - this.tiles.get(c - 1, r).height));
                    t.cliffs[1] = determineCliff(Math.abs(t.height - this.tiles.get(c, r + 1).height));
                    t.cliffs[2] = determineCliff(Math.abs(t.height - this.tiles.get(c + 1, r).height));
                    t.cliffs[3] = determineCliff(Math.abs(t.height - this.tiles.get(c, r -1).height));
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
        const tileSize = Math.round(DEFAULT_TILE_SIZE * this.zoom);
        const halfWidth = MGame.DISPLAY_SIZE_X / (2 * Main.Settings.mapTilesX * tileSize);
        const halfHeight = MGame.DISPLAY_SIZE_Y / (2 * Main.Settings.mapTilesY * tileSize);
        this.pos[0] = MUtilities.clip(this.pos[0], halfWidth, 1 - halfWidth);
        this.pos[1] = MUtilities.clip(this.pos[1], halfHeight, 1 - halfHeight);
    }

    scale(delta: number)
    {
        const zoomMin = Math.max(MGame.DISPLAY_SIZE_X / (Main.Settings.mapTilesX * DEFAULT_TILE_SIZE), MGame.DISPLAY_SIZE_Y / (Main.Settings.mapTilesY * DEFAULT_TILE_SIZE), CAMERA_ZOOM_MIN);
        this.zoom = MUtilities.clip(this.zoom * Math.exp(delta * CAMERA_ZOOM_SPEED), zoomMin, CAMERA_ZOOM_MAX)
    }
}

export class Main extends MGame.Game
{
    private static instance: Main;
    private map: TileMap;
    private camera: Camera;
    private settings: MSettings.Settings;
    private tileAtlasTerrain: CanvasImageSource;
    private tileAtlasVegetation: CanvasImageSource;
    private tileAtlasCliff: CanvasImageSource;

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
        // Load images:
        this.tileAtlasTerrain = MLoader.getImage('terrain');
        this.tileAtlasVegetation = MLoader.getImage('vegetation');
        this.tileAtlasCliff = MLoader.getImage('cliff');
        // Create map:
        this.settings = new MSettings.Settings(MSettings.MapType.TEST, MSettings.MapSize.TINY);
        this.map = new TileMap(this.settings.mapTilesX, this.settings.mapTilesY);
        // Create camera and input listeners:
        this.camera = new Camera([0.5, 0.5], 1, CAMERA_SPEED_NORMAL);
        MKeyboard.listenForKeys([MKeyboard.LEFT, MKeyboard.RIGHT, MKeyboard.UP, MKeyboard.DOWN, MKeyboard.W, MKeyboard.A, MKeyboard.S, MKeyboard.D, MKeyboard.SHIFT]);
        MKeyboard.listenForMouse();
        MKeyboard.onWheelScrolling(function(event: { preventDefault: () => void; deltaY: number; })
        {
            event.preventDefault();
            if (event.deltaY != undefined)
            {
                this.camera.scale(-event.deltaY);
            }
        }.bind(this));
        MKeyboard.onMouseMove(function(event: { pageX: any; pageY: any; preventDefault: () => void; })
        {
            let newMousePos = [event.pageX, event.pageY];
            let oldMousePos = MKeyboard.getMousePos();
            let displayRect = this.ctx.canvas.getBoundingClientRect();
            if (MKeyboard.isMouseDown() && MUtilities.isInRect(oldMousePos, displayRect.left, displayRect.top, displayRect.right, displayRect.bottom))
            {
                event.preventDefault();
                this.camera.move(CAMERA_DRAG_FACTOR * (oldMousePos[0] - newMousePos[0]), CAMERA_DRAG_FACTOR * (oldMousePos[1] - newMousePos[1]));
            }
            MKeyboard.setMousePos(newMousePos);
        }.bind(this));
    };

    load()
    {
        return [
            MLoader.loadImage('terrain', '../assets/terrain.png'),
            MLoader.loadImage('vegetation', '../assets/vegetation.png'),
            MLoader.loadImage('cliff', '../assets/cliff.png')
        ];
    };

    update(delta: number)
    {
        let dirX = 0;
        let dirY = 0;
        // Handle camera movement with keys:
        if (MKeyboard.isKeyDown(MKeyboard.LEFT)) { dirX = -1; }
        if (MKeyboard.isKeyDown(MKeyboard.RIGHT)) { dirX = 1; }
        if (MKeyboard.isKeyDown(MKeyboard.UP)) { dirY = -1; }
        if (MKeyboard.isKeyDown(MKeyboard.DOWN)) { dirY = 1; }
        if (MKeyboard.isKeyDown(MKeyboard.A)) { dirX = -1; }
        if (MKeyboard.isKeyDown(MKeyboard.D)) { dirX = 1; }
        if (MKeyboard.isKeyDown(MKeyboard.W)) { dirY = -1; }
        if (MKeyboard.isKeyDown(MKeyboard.S)) { dirY = 1; }
        if (MKeyboard.isKeyDown(MKeyboard.SHIFT)) { this.camera.speed = CAMERA_SPEED_FAST; } else { this.camera.speed = CAMERA_SPEED_NORMAL; }
        this.camera.move(dirX * delta, dirY * delta);
    };

    render()
    {
        // Draw map tiles:
        const tileSize = Math.round(DEFAULT_TILE_SIZE * this.camera.zoom);
        const startCol = Math.floor(this.camera.pos[0] * this.settings.mapTilesX - (0.5 * MGame.DISPLAY_SIZE_X / tileSize));
        const endCol = Math.ceil(this.camera.pos[0] * this.settings.mapTilesX + (0.5 * MGame.DISPLAY_SIZE_X / tileSize));
        const offsetCol = this.camera.pos[0] * this.settings.mapTilesX - 0.5 * MGame.DISPLAY_SIZE_X / tileSize;
        const startRow = Math.floor(this.camera.pos[1] * this.settings.mapTilesY - (0.5 * MGame.DISPLAY_SIZE_Y / tileSize));
        const endRow = Math.ceil(this.camera.pos[1] * this.settings.mapTilesY + (0.5 * MGame.DISPLAY_SIZE_Y / tileSize));
        const offsetRow = this.camera.pos[1] * this.settings.mapTilesY - 0.5 * MGame.DISPLAY_SIZE_Y / tileSize;
        for (let c = startCol; c < endCol; c++)
        {
            for (let r = startRow; r < endRow; r++)
            {
                let displayX = Math.round((c - offsetCol) * tileSize);
                let displayY = Math.round((r - offsetRow) * tileSize);
                this.map.tiles.get(c, r).drawImages(this.ctx, displayX, displayY, tileSize, [this.tileAtlasTerrain, this.tileAtlasVegetation, this.tileAtlasCliff]);
            }
        }
    }
}


// --------------------
// Data code
// --------------------

const CAMERA_SPEED_NORMAL = 0.1;
const CAMERA_SPEED_FAST = CAMERA_SPEED_NORMAL * 3;
const CAMERA_DRAG_FACTOR = 0.001;
const CAMERA_ZOOM_MIN = 0.1;
const CAMERA_ZOOM_MAX = 4.0;
const CAMERA_ZOOM_SPEED = 0.05;
const DEFAULT_TILE_SIZE = 64;  // In pixels