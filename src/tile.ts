// --------------------
// Functional code
// --------------------

class Tile
{
	private height: number;
	private climate: Tile.Climate;
	private fertility: number;
	private terrain: Tile.Terrain;
	private vegetation: Tile.Vegetation;

	constructor(heightNoise: number, fertilityNoise: number, latitudeFactor: number)
	{
		if (heightNoise <= Main.Settings.waterPercentage)
		{
			this.height = Utilities.interpolateLinear(Main.Settings.heightMin, 0, heightNoise / Main.Settings.waterPercentage);
		}
		else
		{
			this.height = Utilities.interpolateCubic(0, Main.Settings.heightMax, (heightNoise - Main.Settings.waterPercentage) / (1 - Main.Settings.waterPercentage), -Main.Settings.heightMax * Main.Settings.flatnessFactorLowlands, Main.Settings.heightMax + Main.Settings.heightMax * Main.Settings.flatnessFactorHighlands);
		}
		this.climate = Tile.determineTileClimate(latitudeFactor);
		this.fertility = Tile.determineFertility(this.climate, this.height, fertilityNoise);
		this.terrain = Tile.determineTerrain(this.height, this.climate);
		this.vegetation = Tile.determineVegetation(this.height, this.climate, this.fertility);
		// console.log(this._height, this._climate, this._fertility, this._terrain, this._vegetation);
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

	/**
	 * @returns {number} height
	 */
	public get Height(): number
	{
		return this.height;
	}

	 /**
	  * @param {Terrain} ter
	  */
	public set Terrain(ter: Tile.Terrain)
	{
		this.terrain = ter;
	}

	 /**
	  * @param {Vegetation} veg
	  */
	public set Vegetation(veg: Tile.Vegetation)
	{
		this.vegetation = veg;
	}

	public drawImages(ctx: CanvasRenderingContext2D, displayX: number, displayY: number, tileSize: number, tileAtlases: CanvasImageSource[])
	{
		this.drawImage(ctx, displayX, displayY, tileSize, tileAtlases[0], Tile.getTerrainImageData(this.terrain));
		this.drawImage(ctx, displayX, displayY, tileSize, tileAtlases[1], Tile.getVegetationImageData(this.vegetation));
	}
}


// --------------------
// Data code
// --------------------

namespace Tile
{
	const TILE_SIZE_TERRAIN = 64;
	const TILE_SIZE_VEGETATION = 64;

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
		CLIFF,
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

	export function determineTileClimate(latitudeFactor: number): Climate
	{
		latitudeFactor = Utilities.clip(latitudeFactor + 0.05 * (Math.random() - 0.5), 0, 1);
		if (latitudeFactor >= 0.45 && latitudeFactor <= 0.55) { return Tile.Climate.HOT; }
		else if (latitudeFactor >= 0.35 && latitudeFactor <= 0.65) { return Tile.Climate.WARM; }
		else if (latitudeFactor >= 0.15 && latitudeFactor <= 0.85) { return Tile.Climate.MILD; }
		else if (latitudeFactor >= 0.05 && latitudeFactor <= 0.95) { return Tile.Climate.COLD; }
		else if (latitudeFactor >= 0.00 && latitudeFactor <= 1.00) { return Tile.Climate.ICY; }
		else { throw new Error('Invalid given latitudeFactor (' + latitudeFactor + '), has to be between 0 and 1'); }
	};

	export function determineFertility(climate: Climate, height: number, fertilityNoise: number): number
	{
		switch (climate)
		{
			case Tile.Climate.ICY:
				if (height <= 500) { return fertilityNoise; }
				else { return 0; }
			case Tile.Climate.COLD:
				if (height <= 1500) { return fertilityNoise; }
				else { return 0; }
			case Tile.Climate.MILD:
				if (height <= 2500) { return fertilityNoise; }
				else { return 0; }
			case Tile.Climate.WARM:
				if (height <= 3500) { return fertilityNoise; }
				else { return 0; }
			case Tile.Climate.HOT:
				if (height <= 500) { return fertilityNoise; }
				else { return 0; }
			default:
				throw new Error('Invalid given climate type (' + climate + ')');
		}
	};

	export function determineTerrain(height: number, climate: Climate): Terrain
	{
		if (height < Main.Settings.heightMin || height > Main.Settings.heightMax)
		{
			throw new Error('Invalid given height (' + height + '), has to be between ' + Main.Settings.heightMin + ' and ' + Main.Settings.heightMax);
		}
		if (height <= 0)
		{
			if (climate == Tile.Climate.ICY) { return Tile.Terrain.ICE; }
			else { return Tile.Terrain.WATER; }
		}
		else if (height <= 500)
		{
			if (climate == Tile.Climate.ICY || climate == Tile.Climate.HOT) { return Tile.Terrain.EARTH; }
			else { return Tile.Terrain.SWAMP; }
		}
		else if (height <= 1500)
		{
			if (climate == Tile.Climate.ICY) { return Tile.Terrain.SNOW; }
			else if (climate == Tile.Climate.HOT) { return Tile.Terrain.SAND; }
			else { return Tile.Terrain.EARTH; }
		}
		else if (height <= 2500)
		{
			if (climate == Tile.Climate.ICY || climate == Tile.Climate.COLD) { return Tile.Terrain.SNOW; }
			else { return Tile.Terrain.EARTH; }
		}
		else if (height <= 3500)
		{
			if (climate == Tile.Climate.ICY || climate == Tile.Climate.COLD || climate == Tile.Climate.MILD) { return Tile.Terrain.SNOW; }
			else { return Tile.Terrain.EARTH; }
		}
		else
		{
			if (climate == Tile.Climate.ICY || climate == Tile.Climate.COLD || climate == Tile.Climate.MILD || climate == Tile.Climate.WARM) { return Tile.Terrain.SNOW; }
			else { return Tile.Terrain.EARTH; }
		}
	};

	export function determineVegetation(height: number, climate: Climate, fertility: number): Vegetation
	{
		if (fertility > 1 || fertility < 0)
		{
			throw new Error('Invalid given fertility (' + fertility + '), has to be between 0 and 1');
		}
		if (height <= 0)
		{
			return Tile.Vegetation.BARE;
		}
		else if (height <= 500)
		{
			if (fertility >= 0.8) { return Tile.Vegetation.TREES; }
			else if (fertility >= 0.7) { return Tile.Vegetation.SHRUBS; }
			else if (fertility >= 0.4) { return Tile.Vegetation.GRASS; }
			else if (fertility >= 0.2) { return Tile.Vegetation.BARE; }
			else if (fertility >= 0.1) { return Tile.Vegetation.GRAVEL; }
			else { return Tile.Vegetation.ROCKS; }
		}
		else if (height <= 1500)
		{
			if (climate == Tile.Climate.ICY || climate == Tile.Climate.HOT)
			{
				if (fertility >= 0.5) { return Tile.Vegetation.BARE; }
				else if (fertility >= 0.25) { return Tile.Vegetation.GRAVEL; }
				else { return Tile.Vegetation.ROCKS; }
			}
			else
			{
				if (fertility >= 0.8) { return Tile.Vegetation.TREES; }
				else if (fertility >= 0.7) { return Tile.Vegetation.SHRUBS; }
				else if (fertility >= 0.4) { return Tile.Vegetation.GRASS; }
				else if (fertility >= 0.2) { return Tile.Vegetation.BARE; }
				else if (fertility >= 0.1) { return Tile.Vegetation.GRAVEL; }
				else { return Tile.Vegetation.ROCKS; }
			}
		}
		else if (height <= 2500)
		{
			if (climate == Tile.Climate.ICY || climate == Tile.Climate.COLD)
			{
				if (fertility >= 0.5) { return Tile.Vegetation.BARE; }
				else if (fertility >= 0.25) { return Tile.Vegetation.GRAVEL; }
				else { return Tile.Vegetation.ROCKS; }
			}
			else
			{
				if (fertility >= 0.8) { return Tile.Vegetation.TREES; }
				else if (fertility >= 0.7) { return Tile.Vegetation.SHRUBS; }
				else if (fertility >= 0.4) { return Tile.Vegetation.GRASS; }
				else if (fertility >= 0.2) { return Tile.Vegetation.BARE; }
				else if (fertility >= 0.1) { return Tile.Vegetation.GRAVEL; }
				else { return Tile.Vegetation.ROCKS; }
			}
		}
		else if (height <= 3500)
		{
			if (climate == Tile.Climate.ICY || climate == Tile.Climate.COLD || climate == Tile.Climate.MILD)
			{
				if (fertility >= 0.5) { return Tile.Vegetation.BARE; }
				else if (fertility >= 0.25) { return Tile.Vegetation.GRAVEL; }
				else { return Tile.Vegetation.ROCKS; }
			}
			else
			{
				if (fertility >= 0.8) { return Tile.Vegetation.TREES; }
				else if (fertility >= 0.7) { return Tile.Vegetation.SHRUBS; }
				else if (fertility >= 0.4) { return Tile.Vegetation.GRASS; }
				else if (fertility >= 0.2) { return Tile.Vegetation.BARE; }
				else if (fertility >= 0.1) { return Tile.Vegetation.GRAVEL; }
				else { return Tile.Vegetation.ROCKS; }
			}
		}
		else
		{
			if (climate == Tile.Climate.ICY || climate == Tile.Climate.COLD || climate == Tile.Climate.MILD || climate == Tile.Climate.WARM)
			{
				if (fertility >= 0.5) { return Tile.Vegetation.BARE; }
				else if (fertility >= 0.25) { return Tile.Vegetation.GRAVEL; }
				else { return Tile.Vegetation.ROCKS; }
			}
			else
			{
				if (fertility >= 0.8) { return Tile.Vegetation.TREES; }
				else if (fertility >= 0.7) { return Tile.Vegetation.SHRUBS; }
				else if (fertility >= 0.4) { return Tile.Vegetation.GRASS; }
				else if (fertility >= 0.2) { return Tile.Vegetation.BARE; }
				else if (fertility >= 0.1) { return Tile.Vegetation.GRAVEL; }
				else { return Tile.Vegetation.ROCKS; }
			}
		}
	};

	export function getTerrainImageData(terrain: Terrain): number[]
	{
		switch (terrain)
		{
			case Tile.Terrain.WATER:
				return [TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN];
			case Tile.Terrain.EARTH:
				return [TILE_SIZE_TERRAIN * 1, TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN];
			case Tile.Terrain.SNOW:
				return [TILE_SIZE_TERRAIN * 2, TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN];
			case Tile.Terrain.ICE:
				return [TILE_SIZE_TERRAIN * 3, TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN];
			case Tile.Terrain.SAND:
				return [TILE_SIZE_TERRAIN * 4, TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN];
			case Tile.Terrain.SWAMP:
				return [TILE_SIZE_TERRAIN * 5, TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN];
			case Tile.Terrain.CLIFF:
				return [TILE_SIZE_TERRAIN * 6, TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN];
			default:
				throw new Error('Invalid given terrain type (' + terrain + ')');
		}
	}

	export function getVegetationImageData(vegetation: Vegetation): number[]
	{
		switch (vegetation)
		{
			case Tile.Vegetation.TREES:
				return [TILE_SIZE_VEGETATION * 0, TILE_SIZE_VEGETATION * 0, TILE_SIZE_VEGETATION];
			case Tile.Vegetation.SHRUBS:
				return [TILE_SIZE_VEGETATION * 1, TILE_SIZE_VEGETATION * 0, TILE_SIZE_VEGETATION];
			case Tile.Vegetation.GRASS:
				return [TILE_SIZE_VEGETATION * 2, TILE_SIZE_VEGETATION * 0, TILE_SIZE_VEGETATION];
			case Tile.Vegetation.BARE:
				return [TILE_SIZE_VEGETATION * 3, TILE_SIZE_VEGETATION * 0, TILE_SIZE_VEGETATION];
			case Tile.Vegetation.GRAVEL:
				return [TILE_SIZE_VEGETATION * 4, TILE_SIZE_VEGETATION * 0, TILE_SIZE_VEGETATION];
			case Tile.Vegetation.ROCKS:
				return [TILE_SIZE_VEGETATION * 5, TILE_SIZE_VEGETATION * 0, TILE_SIZE_VEGETATION];
			default:
				throw new Error('Invalid given vegetation type (' + vegetation + ')');
		}
	}
}