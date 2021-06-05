import { Main } from "./main.js";
import * as MUtilities from "./utilities.js";


// --------------------
// Functional code
// --------------------

export class Tile
{
	public height: number;
	public climate: Climate;
	public fertility: number;
	public terrain: Terrain;
	public vegetation: Vegetation;
	public cliffs: Cliff[];  // North, East, South, West

	constructor(heightNoise: number, fertilityNoise: number, latitudeFactor: number)
	{
		if (heightNoise <= Main.Settings.waterPercentage)
		{
			this.height = MUtilities.interpolateLinear(Main.Settings.heightMin, 0, heightNoise / Main.Settings.waterPercentage);
		}
		else
		{
			this.height = MUtilities.interpolateCubic(0, Main.Settings.heightMax, (heightNoise - Main.Settings.waterPercentage) / (1 - Main.Settings.waterPercentage), -Main.Settings.heightMax * Main.Settings.flatnessFactorLowlands, Main.Settings.heightMax + Main.Settings.heightMax * Main.Settings.flatnessFactorHighlands);
		}
		this.climate = determineClimate(latitudeFactor);
		this.fertility = determineFertility(this.climate, this.height, fertilityNoise);
		this.terrain = determineTerrain(this.height, this.climate);
		this.vegetation = determineVegetation(this.height, this.climate, this.fertility);
		this.cliffs = [Cliff.NONE, Cliff.NONE, Cliff.NONE, Cliff.NONE];
	}

	private drawImage(ctx: CanvasRenderingContext2D, displayX: number, displayY: number, tileSize: number, tileAtlas: CanvasImageSource, imageData: number[])
	{
		ctx.drawImage
		(
			tileAtlas, // image
			imageData[0], // source x
			imageData[1], // source y
			imageData[2], // source width
			imageData[2], // source height
			displayX,  // target x
			displayY, // target y
			tileSize, // target width
			tileSize // target height
		);
	}

	public drawImages(ctx: CanvasRenderingContext2D, displayX: number, displayY: number, tileSize: number, tileAtlases: CanvasImageSource[])
	{
		this.drawImage(ctx, displayX, displayY, tileSize, tileAtlases[0], getTerrainImageData(this.terrain));
		this.drawImage(ctx, displayX, displayY, tileSize, tileAtlases[1], getVegetationImageData(this.vegetation));
		this.drawImage(ctx, displayX, displayY, tileSize, tileAtlases[2], getCliffImageData(this.cliffs[0]));  // TODO: also draw entries 1-3 with correct rotation
	}
}


// --------------------
// Data code
// --------------------

const TILE_SIZE_TERRAIN = 64;
const TILE_SIZE_VEGETATION = 64;
const TILE_SIZE_CLIFF = 64;

export enum Climate
{
	ICY,
	COLD,
	MILD,
	WARM,
	HOT,
}

export enum Terrain
{
	WATER,
	EARTH,
	SNOW,
	ICE,
	SAND,
	SWAMP,
}

export enum Vegetation
{
	TREES,
	SHRUBS,
	GRASS,
	BARE,
	GRAVEL,
	ROCKS,
}

export enum Cliff
{
	NONE,
	SMALL,
	MEDIUM,
	LARGE,
}

function determineClimate(latitudeFactor: number): Climate
{
	latitudeFactor = MUtilities.clip(latitudeFactor + 0.05 * (Math.random() - 0.5), 0, 1);
	if (latitudeFactor >= 0.45 && latitudeFactor <= 0.55) { return Climate.HOT; }
	else if (latitudeFactor >= 0.35 && latitudeFactor <= 0.65) { return Climate.WARM; }
	else if (latitudeFactor >= 0.15 && latitudeFactor <= 0.85) { return Climate.MILD; }
	else if (latitudeFactor >= 0.05 && latitudeFactor <= 0.95) { return Climate.COLD; }
	else if (latitudeFactor >= 0.00 && latitudeFactor <= 1.00) { return Climate.ICY; }
	else { throw new Error('Invalid given latitudeFactor (' + latitudeFactor + '), has to be between 0 and 1'); }
}

function determineFertility(climate: Climate, height: number, fertilityNoise: number): number
{
	switch (climate)
	{
		case Climate.ICY:
			if (height <= 500) { return fertilityNoise; }
			else { return 0; }
		case Climate.COLD:
			if (height <= 1500) { return fertilityNoise; }
			else { return 0; }
		case Climate.MILD:
			if (height <= 2500) { return fertilityNoise; }
			else { return 0; }
		case Climate.WARM:
			if (height <= 3500) { return fertilityNoise; }
			else { return 0; }
		case Climate.HOT:
			if (height <= 500) { return fertilityNoise; }
			else { return 0; }
		default:
			throw new Error('Invalid given climate type (' + climate + ')');
	}
}

function determineTerrain(height: number, climate: Climate): Terrain
{
	if (height < Main.Settings.heightMin || height > Main.Settings.heightMax)
	{
		throw new Error('Invalid given height (' + height + '), has to be between ' + Main.Settings.heightMin + ' and ' + Main.Settings.heightMax);
	}
	if (height <= 0)
	{
		if (climate == Climate.ICY) { return Terrain.ICE; }
		else { return Terrain.WATER; }
	}
	else if (height <= 500)
	{
		if (climate == Climate.ICY || climate == Climate.HOT) { return Terrain.EARTH; }
		else { return Terrain.SWAMP; }
	}
	else if (height <= 1500)
	{
		if (climate == Climate.ICY) { return Terrain.SNOW; }
		else if (climate == Climate.HOT) { return Terrain.SAND; }
		else { return Terrain.EARTH; }
	}
	else if (height <= 2500)
	{
		if (climate == Climate.ICY || climate == Climate.COLD) { return Terrain.SNOW; }
		else { return Terrain.EARTH; }
	}
	else if (height <= 3500)
	{
		if (climate == Climate.ICY || climate == Climate.COLD || climate == Climate.MILD) { return Terrain.SNOW; }
		else { return Terrain.EARTH; }
	}
	else
	{
		if (climate == Climate.ICY || climate == Climate.COLD || climate == Climate.MILD || climate == Climate.WARM) { return Terrain.SNOW; }
		else { return Terrain.EARTH; }
	}
}

function determineVegetation(height: number, climate: Climate, fertility: number): Vegetation
{
	if (fertility > 1 || fertility < 0)
	{
		throw new Error('Invalid given fertility (' + fertility + '), has to be between 0 and 1');
	}
	if (height <= 0)
	{
		return Vegetation.BARE;
	}
	else if (height <= 500)
	{
		if (fertility >= 0.8) { return Vegetation.TREES; }
		else if (fertility >= 0.7) { return Vegetation.SHRUBS; }
		else if (fertility >= 0.4) { return Vegetation.GRASS; }
		else if (fertility >= 0.2) { return Vegetation.BARE; }
		else if (fertility >= 0.1) { return Vegetation.GRAVEL; }
		else { return Vegetation.ROCKS; }
	}
	else if (height <= 1500)
	{
		if (climate == Climate.ICY || climate == Climate.HOT)
		{
			if (fertility >= 0.5) { return Vegetation.BARE; }
			else if (fertility >= 0.25) { return Vegetation.GRAVEL; }
			else { return Vegetation.ROCKS; }
		}
		else
		{
			if (fertility >= 0.8) { return Vegetation.TREES; }
			else if (fertility >= 0.7) { return Vegetation.SHRUBS; }
			else if (fertility >= 0.4) { return Vegetation.GRASS; }
			else if (fertility >= 0.2) { return Vegetation.BARE; }
			else if (fertility >= 0.1) { return Vegetation.GRAVEL; }
			else { return Vegetation.ROCKS; }
		}
	}
	else if (height <= 2500)
	{
		if (climate == Climate.ICY || climate == Climate.COLD)
		{
			if (fertility >= 0.5) { return Vegetation.BARE; }
			else if (fertility >= 0.25) { return Vegetation.GRAVEL; }
			else { return Vegetation.ROCKS; }
		}
		else
		{
			if (fertility >= 0.8) { return Vegetation.TREES; }
			else if (fertility >= 0.7) { return Vegetation.SHRUBS; }
			else if (fertility >= 0.4) { return Vegetation.GRASS; }
			else if (fertility >= 0.2) { return Vegetation.BARE; }
			else if (fertility >= 0.1) { return Vegetation.GRAVEL; }
			else { return Vegetation.ROCKS; }
		}
	}
	else if (height <= 3500)
	{
		if (climate == Climate.ICY || climate == Climate.COLD || climate == Climate.MILD)
		{
			if (fertility >= 0.5) { return Vegetation.BARE; }
			else if (fertility >= 0.25) { return Vegetation.GRAVEL; }
			else { return Vegetation.ROCKS; }
		}
		else
		{
			if (fertility >= 0.8) { return Vegetation.TREES; }
			else if (fertility >= 0.7) { return Vegetation.SHRUBS; }
			else if (fertility >= 0.4) { return Vegetation.GRASS; }
			else if (fertility >= 0.2) { return Vegetation.BARE; }
			else if (fertility >= 0.1) { return Vegetation.GRAVEL; }
			else { return Vegetation.ROCKS; }
		}
	}
	else
	{
		if (climate == Climate.ICY || climate == Climate.COLD || climate == Climate.MILD || climate == Climate.WARM)
		{
			if (fertility >= 0.5) { return Vegetation.BARE; }
			else if (fertility >= 0.25) { return Vegetation.GRAVEL; }
			else { return Vegetation.ROCKS; }
		}
		else
		{
			if (fertility >= 0.8) { return Vegetation.TREES; }
			else if (fertility >= 0.7) { return Vegetation.SHRUBS; }
			else if (fertility >= 0.4) { return Vegetation.GRASS; }
			else if (fertility >= 0.2) { return Vegetation.BARE; }
			else if (fertility >= 0.1) { return Vegetation.GRAVEL; }
			else { return Vegetation.ROCKS; }
		}
	}
}

export function determineCliff(heightDiff: number): Cliff
{
	if (heightDiff < 200) { return Cliff.NONE; }
	else if (heightDiff < 300) { return Cliff.SMALL; }
	else if (heightDiff < 400) { return Cliff.MEDIUM; }
	else { return Cliff.LARGE; }
}

function getTerrainImageData(terrain: Terrain): number[]
{
	switch (terrain)
	{
		case Terrain.WATER:
			return [TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN];
		case Terrain.EARTH:
			return [TILE_SIZE_TERRAIN * 1, TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN];
		case Terrain.SNOW:
			return [TILE_SIZE_TERRAIN * 2, TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN];
		case Terrain.ICE:
			return [TILE_SIZE_TERRAIN * 3, TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN];
		case Terrain.SAND:
			return [TILE_SIZE_TERRAIN * 4, TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN];
		case Terrain.SWAMP:
			return [TILE_SIZE_TERRAIN * 5, TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN];
		default:
			throw new Error('Invalid given terrain type (' + terrain + ')');
	}
}

function getVegetationImageData(vegetation: Vegetation): number[]
{
	switch (vegetation)
	{
		case Vegetation.TREES:
			return [TILE_SIZE_VEGETATION * 0, TILE_SIZE_VEGETATION * 0, TILE_SIZE_VEGETATION];
		case Vegetation.SHRUBS:
			return [TILE_SIZE_VEGETATION * 1, TILE_SIZE_VEGETATION * 0, TILE_SIZE_VEGETATION];
		case Vegetation.GRASS:
			return [TILE_SIZE_VEGETATION * 2, TILE_SIZE_VEGETATION * 0, TILE_SIZE_VEGETATION];
		case Vegetation.BARE:
			return [TILE_SIZE_VEGETATION * 3, TILE_SIZE_VEGETATION * 0, TILE_SIZE_VEGETATION];
		case Vegetation.GRAVEL:
			return [TILE_SIZE_VEGETATION * 4, TILE_SIZE_VEGETATION * 0, TILE_SIZE_VEGETATION];
		case Vegetation.ROCKS:
			return [TILE_SIZE_VEGETATION * 5, TILE_SIZE_VEGETATION * 0, TILE_SIZE_VEGETATION];
		default:
			throw new Error('Invalid given vegetation type (' + vegetation + ')');
	}
}

function getCliffImageData(cliff: Cliff): number[]
{
	switch (cliff)
	{
		case Cliff.NONE:
			return [TILE_SIZE_CLIFF * 0, TILE_SIZE_CLIFF * 0, TILE_SIZE_CLIFF];
		case Cliff.SMALL:
			return [TILE_SIZE_CLIFF * 1, TILE_SIZE_CLIFF * 0, TILE_SIZE_CLIFF];
		case Cliff.MEDIUM:
			return [TILE_SIZE_CLIFF * 2, TILE_SIZE_CLIFF * 0, TILE_SIZE_CLIFF];
		case Cliff.LARGE:
			return [TILE_SIZE_CLIFF * 3, TILE_SIZE_CLIFF * 0, TILE_SIZE_CLIFF];
		default:
			throw new Error('Invalid given cliff type (' + cliff + ')');
	}
}