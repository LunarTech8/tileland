class Tile
{
	// --------------------
	// Data code
	// --------------------

	static HEIGHT_MIN = -2000;  // In meters
	static HEIGHT_MAX = 4000;  // In meters
	static CLIFF_MIN_DIFF = 250;  // In meters
	static TILE_SIZE_TERRAIN = 64;
	static TILE_SIZE_VEGETATION = 64;
	static WATER_PERCENTAGE = 0.55;
	static FLATNESS_FACTOR_LOWLANDS = 0.2;  // 0 = No flattening, 1 = Max flattening towards lowlands
	static FLATNESS_FACTOR_HIGHLANDS = 0.2;  // 0 = No flattening, 1 = Max flattening towards highlands

	static Climate = Object.freeze
	({
		ICY: 1,
		COLD: 2,
		MILD: 3,
		WARM: 4,
		HOT: 5
	});

	static Terrain = Object.freeze
	({
		WATER: 1,
		EARTH: 2,
		SNOW: 3,
		ICE: 4,
		SAND: 5,
		SWAMP: 6,
		CLIFF: 7
	});

	static Vegetation = Object.freeze
	({
		TREES: 1,
		SHRUBS: 2,
		GRASS: 3,
		BARE: 4,
		GRAVEL: 5,
		ROCKS: 6,
	});

	static _determineTileClimate = function(latitudeFactor)
	{
		latitudeFactor = Utilities.clip(latitudeFactor + 0.05 * (Math.random() - 0.5), 0, 1);
		if (latitudeFactor >= 0.45 && latitudeFactor <= 0.55) { return Tile.Climate.HOT; }
		else if (latitudeFactor >= 0.35 && latitudeFactor <= 0.65) { return Tile.Climate.WARM; }
		else if (latitudeFactor >= 0.15 && latitudeFactor <= 0.85) { return Tile.Climate.MILD; }
		else if (latitudeFactor >= 0.05 && latitudeFactor <= 0.95) { return Tile.Climate.COLD; }
		else if (latitudeFactor >= 0.00 && latitudeFactor <= 1.00) { return Tile.Climate.ICY; }
		else { throw new Error('Invalid given latitudeFactor (' + latitudeFactor + '), has to be between 0 and 1'); }
	};

	static _determineFertility = function(climate, height, fertilityNoise)
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

	static _determineTerrain = function(height, climate)
	{
		if (height < Tile.HEIGHT_MIN || height > Tile.HEIGHT_MAX)
		{
			throw new Error('Invalid given height (' + height + '), has to be between ' + Tile.HEIGHT_MIN + ' and ' + Tile.HEIGHT_MAX);
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

	static _determineVegetation = function(height, climate, fertility)
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

	static _getTerrainImageData = function(terrain)
	{
		switch (terrain)
		{
			case Tile.Terrain.WATER:
				return [Tile.TILE_SIZE_TERRAIN * 0, Tile.TILE_SIZE_TERRAIN * 0, Tile.TILE_SIZE_TERRAIN];
			case Tile.Terrain.EARTH:
				return [Tile.TILE_SIZE_TERRAIN * 1, Tile.TILE_SIZE_TERRAIN * 0, Tile.TILE_SIZE_TERRAIN];
			case Tile.Terrain.SNOW:
				return [Tile.TILE_SIZE_TERRAIN * 2, Tile.TILE_SIZE_TERRAIN * 0, Tile.TILE_SIZE_TERRAIN];
			case Tile.Terrain.ICE:
				return [Tile.TILE_SIZE_TERRAIN * 3, Tile.TILE_SIZE_TERRAIN * 0, Tile.TILE_SIZE_TERRAIN];
			case Tile.Terrain.SAND:
				return [Tile.TILE_SIZE_TERRAIN * 4, Tile.TILE_SIZE_TERRAIN * 0, Tile.TILE_SIZE_TERRAIN];
			case Tile.Terrain.SWAMP:
				return [Tile.TILE_SIZE_TERRAIN * 5, Tile.TILE_SIZE_TERRAIN * 0, Tile.TILE_SIZE_TERRAIN];
			case Tile.Terrain.CLIFF:
				return [Tile.TILE_SIZE_TERRAIN * 6, Tile.TILE_SIZE_TERRAIN * 0, Tile.TILE_SIZE_TERRAIN];
			default:
				throw new Error('Invalid given terrain type (' + terrain + ')');
		}
	}

	static _getVegetationImageData = function(vegetation)
	{
		switch (vegetation)
		{
			case Tile.Vegetation.TREES:
				return [Tile.TILE_SIZE_VEGETATION * 0, Tile.TILE_SIZE_VEGETATION * 0, Tile.TILE_SIZE_VEGETATION];
			case Tile.Vegetation.SHRUBS:
				return [Tile.TILE_SIZE_VEGETATION * 1, Tile.TILE_SIZE_VEGETATION * 0, Tile.TILE_SIZE_VEGETATION];
			case Tile.Vegetation.GRASS:
				return [Tile.TILE_SIZE_VEGETATION * 2, Tile.TILE_SIZE_VEGETATION * 0, Tile.TILE_SIZE_VEGETATION];
			case Tile.Vegetation.BARE:
				return [Tile.TILE_SIZE_VEGETATION * 3, Tile.TILE_SIZE_VEGETATION * 0, Tile.TILE_SIZE_VEGETATION];
			case Tile.Vegetation.GRAVEL:
				return [Tile.TILE_SIZE_VEGETATION * 4, Tile.TILE_SIZE_VEGETATION * 0, Tile.TILE_SIZE_VEGETATION];
			case Tile.Vegetation.ROCKS:
				return [Tile.TILE_SIZE_VEGETATION * 5, Tile.TILE_SIZE_VEGETATION * 0, Tile.TILE_SIZE_VEGETATION];
			default:
				throw new Error('Invalid given vegetation type (' + vegetation + ')');
		}
	}


	// --------------------
	// Functional code
	// --------------------

	_height;
	_climate;
	_fertility;
	_terrain;
	_vegetation;

	constructor(heightNoise, fertilityNoise, latitudeFactor)
	{
		if (heightNoise <= Tile.WATER_PERCENTAGE)
		{
			this._height = Utilities.interpolateLinear(Tile.HEIGHT_MIN, 0, heightNoise / Tile.WATER_PERCENTAGE);
		}
		else
		{
			this._height = Utilities.interpolateCubic(0, Tile.HEIGHT_MAX, (heightNoise - Tile.WATER_PERCENTAGE) / (1 - Tile.WATER_PERCENTAGE), -Tile.HEIGHT_MAX * Tile.FLATNESS_FACTOR_LOWLANDS, Tile.HEIGHT_MAX + Tile.HEIGHT_MAX * Tile.FLATNESS_FACTOR_HIGHLANDS);
		}
		this._climate = Tile._determineTileClimate(latitudeFactor);
		this._fertility = Tile._determineFertility(this._climate, this._height, fertilityNoise);
		this._terrain = Tile._determineTerrain(this._height, this._climate);
		this._vegetation = Tile._determineVegetation(this._height, this._climate, this._fertility);
		// console.log(this._height, this._climate, this._fertility, this._terrain, this._vegetation);
	}

	/**
	 * @returns {number} _height
	 */
	 get height()
	 {
		 return this._height;
	 }

	 /**
	  * @param {Terrain} ter
	  */
	 set terrain(ter)
	 {
		 this._terrain = ter;
	 }

	 /**
	  * @param {Vegetation} veg
	  */
	 set vegetation(veg)
	 {
		 this._vegetation = veg;
	 }

	drawImages(ctx, displayX, displayY, tileSize, tileAtlases)
	{
		this._drawImage(ctx, displayX, displayY, tileSize, tileAtlases[0], Tile._getTerrainImageData(this._terrain));
		this._drawImage(ctx, displayX, displayY, tileSize, tileAtlases[1], Tile._getVegetationImageData(this._vegetation));
	}

	_drawImage(ctx, displayX, displayY, tileSize, tileAtlas, imageData)
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
}