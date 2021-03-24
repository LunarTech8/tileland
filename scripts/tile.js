// --------------------
// Data code
// --------------------

const HEIGHT_MIN = -2000;  // In meters
const HEIGHT_MAX = 4000;  // In meters
const CLIFF_MIN_DIFF = 250;  // In meters
const TILE_SIZE_TERRAIN = 64;
const TILE_SIZE_VEGETATION = 64;
const WATER_PERCENTAGE = 0.55;
const FLATNESS_FACTOR_LOWLANDS = 0.2;  // 0 = No flattening, 1 = Max flattening towards lowlands
const FLATNESS_FACTOR_HIGHLANDS = 0.2;  // 0 = No flattening, 1 = Max flattening towards highlands

const Climate = Object.freeze
({
	icy: 1,
	cold: 2,
	mild: 3,
	warm: 4,
	hot: 5
});

const Terrain = Object.freeze
({
	water: 1,
	earth: 2,
	snow: 3,
	ice: 4,
	sand: 5,
	swamp: 6,
	cliff: 7
});

const Vegetation = Object.freeze
({
	trees: 1,
	shrubs: 2,
	grass: 3,
	bare: 4,
	gravel: 5,
	rocks: 6,
});

_determineClimate = function(latitudeFactor)
{
	latitudeFactor = Utilities.clip(latitudeFactor + 0.05 * (Math.random() - 0.5), 0, 1);
	if (latitudeFactor >= 0.45 && latitudeFactor <= 0.55) { return Climate.hot; }
	else if (latitudeFactor >= 0.35 && latitudeFactor <= 0.65) { return Climate.warm; }
	else if (latitudeFactor >= 0.15 && latitudeFactor <= 0.85) { return Climate.mild; }
	else if (latitudeFactor >= 0.05 && latitudeFactor <= 0.95) { return Climate.cold; }
	else if (latitudeFactor >= 0.00 && latitudeFactor <= 1.00) { return Climate.icy; }
	else { throw new Error('Invalid given latitudeFactor (' + latitudeFactor + '), has to be between 0 and 1'); }
};

_determineFertility = function(climate, height, fertilityNoise)
{
	switch (climate)
	{
		case Climate.icy:
			if (height <= 500) { return fertilityNoise; }
			else { return 0; }
		case Climate.cold:
			if (height <= 1500) { return fertilityNoise; }
			else { return 0; }
		case Climate.mild:
			if (height <= 2500) { return fertilityNoise; }
			else { return 0; }
		case Climate.warm:
			if (height <= 3500) { return fertilityNoise; }
			else { return 0; }
		case Climate.hot:
			if (height <= 500) { return fertilityNoise; }
			else { return 0; }
		default:
			throw new Error('Invalid given climate type (' + climate + ')');
	}
};

_determineTerrain = function(height, climate)
{
	if (height < HEIGHT_MIN || height > HEIGHT_MAX)
	{
		throw new Error('Invalid given height (' + height + '), has to be between ' + HEIGHT_MIN + ' and ' + HEIGHT_MAX);
	}
	if (height <= 0)
	{
		if (climate == Climate.icy) { return Terrain.ice; }
		else { return Terrain.water; }
	}
	else if (height <= 500)
	{
		if (climate == Climate.icy || climate == Climate.hot) { return Terrain.earth; }
		else { return Terrain.swamp; }
	}
	else if (height <= 1500)
	{
		if (climate == Climate.icy) { return Terrain.snow; }
		else if (climate == Climate.hot) { return Terrain.sand; }
		else { return Terrain.earth; }
	}
	else if (height <= 2500)
	{
		if (climate == Climate.icy || climate == Climate.cold) { return Terrain.snow; }
		else { return Terrain.earth; }
	}
	else if (height <= 3500)
	{
		if (climate == Climate.icy || climate == Climate.cold || climate == Climate.mild) { return Terrain.snow; }
		else { return Terrain.earth; }
	}
	else
	{
		if (climate == Climate.icy || climate == Climate.cold || climate == Climate.mild || climate == Climate.warm) { return Terrain.snow; }
		else { return Terrain.earth; }
	}
};

_determineVegetation = function(height, climate, fertility)
{
	if (fertility > 1 || fertility < 0)
	{
		throw new Error('Invalid given fertility (' + fertility + '), has to be between 0 and 1');
	}
	if (height <= 0)
	{
		return Vegetation.bare;
	}
	else if (height <= 500)
	{
		if (fertility >= 0.8) { return Vegetation.trees; }
		else if (fertility >= 0.7) { return Vegetation.shrubs; }
		else if (fertility >= 0.4) { return Vegetation.grass; }
		else if (fertility >= 0.2) { return Vegetation.bare; }
		else if (fertility >= 0.1) { return Vegetation.gravel; }
		else { return Vegetation.rocks; }
	}
	else if (height <= 1500)
	{
		if (climate == Climate.icy || climate == Climate.hot)
		{
			if (fertility >= 0.5) { return Vegetation.bare; }
			else if (fertility >= 0.25) { return Vegetation.gravel; }
			else { return Vegetation.rocks; }
		}
		else
		{
			if (fertility >= 0.8) { return Vegetation.trees; }
			else if (fertility >= 0.7) { return Vegetation.shrubs; }
			else if (fertility >= 0.4) { return Vegetation.grass; }
			else if (fertility >= 0.2) { return Vegetation.bare; }
			else if (fertility >= 0.1) { return Vegetation.gravel; }
			else { return Vegetation.rocks; }
		}
	}
	else if (height <= 2500)
	{
		if (climate == Climate.icy || climate == Climate.cold)
		{
			if (fertility >= 0.5) { return Vegetation.bare; }
			else if (fertility >= 0.25) { return Vegetation.gravel; }
			else { return Vegetation.rocks; }
		}
		else
		{
			if (fertility >= 0.8) { return Vegetation.trees; }
			else if (fertility >= 0.7) { return Vegetation.shrubs; }
			else if (fertility >= 0.4) { return Vegetation.grass; }
			else if (fertility >= 0.2) { return Vegetation.bare; }
			else if (fertility >= 0.1) { return Vegetation.gravel; }
			else { return Vegetation.rocks; }
		}
	}
	else if (height <= 3500)
	{
		if (climate == Climate.icy || climate == Climate.cold || climate == Climate.mild)
		{
			if (fertility >= 0.5) { return Vegetation.bare; }
			else if (fertility >= 0.25) { return Vegetation.gravel; }
			else { return Vegetation.rocks; }
		}
		else
		{
			if (fertility >= 0.8) { return Vegetation.trees; }
			else if (fertility >= 0.7) { return Vegetation.shrubs; }
			else if (fertility >= 0.4) { return Vegetation.grass; }
			else if (fertility >= 0.2) { return Vegetation.bare; }
			else if (fertility >= 0.1) { return Vegetation.gravel; }
			else { return Vegetation.rocks; }
		}
	}
	else
	{
		if (climate == Climate.icy || climate == Climate.cold || climate == Climate.mild || climate == Climate.warm)
		{
			if (fertility >= 0.5) { return Vegetation.bare; }
			else if (fertility >= 0.25) { return Vegetation.gravel; }
			else { return Vegetation.rocks; }
		}
		else
		{
			if (fertility >= 0.8) { return Vegetation.trees; }
			else if (fertility >= 0.7) { return Vegetation.shrubs; }
			else if (fertility >= 0.4) { return Vegetation.grass; }
			else if (fertility >= 0.2) { return Vegetation.bare; }
			else if (fertility >= 0.1) { return Vegetation.gravel; }
			else { return Vegetation.rocks; }
		}
	}
};

_getTerrainImageData = function(terrain)
{
	switch (terrain)
	{
		case Terrain.water:
			return [TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN];
		case Terrain.earth:
			return [TILE_SIZE_TERRAIN * 1, TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN];
		case Terrain.snow:
			return [TILE_SIZE_TERRAIN * 2, TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN];
		case Terrain.ice:
			return [TILE_SIZE_TERRAIN * 3, TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN];
		case Terrain.sand:
			return [TILE_SIZE_TERRAIN * 4, TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN];
		case Terrain.swamp:
			return [TILE_SIZE_TERRAIN * 5, TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN];
		case Terrain.cliff:
			return [TILE_SIZE_TERRAIN * 6, TILE_SIZE_TERRAIN * 0, TILE_SIZE_TERRAIN];
		default:
			throw new Error('Invalid given terrain type (' + terrain + ')');
	}
}

_getVegetationImageData = function(vegetation)
{
	switch (vegetation)
	{
		case Vegetation.trees:
			return [TILE_SIZE_VEGETATION * 0, TILE_SIZE_VEGETATION * 0, TILE_SIZE_VEGETATION];
		case Vegetation.shrubs:
			return [TILE_SIZE_VEGETATION * 1, TILE_SIZE_VEGETATION * 0, TILE_SIZE_VEGETATION];
		case Vegetation.grass:
			return [TILE_SIZE_VEGETATION * 2, TILE_SIZE_VEGETATION * 0, TILE_SIZE_VEGETATION];
		case Vegetation.bare:
			return [TILE_SIZE_VEGETATION * 3, TILE_SIZE_VEGETATION * 0, TILE_SIZE_VEGETATION];
		case Vegetation.gravel:
			return [TILE_SIZE_VEGETATION * 4, TILE_SIZE_VEGETATION * 0, TILE_SIZE_VEGETATION];
		case Vegetation.rocks:
			return [TILE_SIZE_VEGETATION * 5, TILE_SIZE_VEGETATION * 0, TILE_SIZE_VEGETATION];
		default:
			throw new Error('Invalid given vegetation type (' + vegetation + ')');
	}
}


// --------------------
// Prototypes
// --------------------

class Tile
{
	_height;
	_climate;
	_fertility;
	_terrain;
	_vegetation;

	constructor(heightNoise, fertilityNoise, latitudeFactor)
	{
		if (heightNoise <= WATER_PERCENTAGE)
		{
			this._height = Utilities.interpolateLinear(HEIGHT_MIN, 0, heightNoise / WATER_PERCENTAGE);
		}
		else
		{
			this._height = Utilities.interpolateCubic(0, HEIGHT_MAX, (heightNoise - WATER_PERCENTAGE) / (1 - WATER_PERCENTAGE), -HEIGHT_MAX * FLATNESS_FACTOR_LOWLANDS, HEIGHT_MAX + HEIGHT_MAX * FLATNESS_FACTOR_HIGHLANDS);
		}
		this._climate = _determineClimate(latitudeFactor);
		this._fertility = _determineFertility(this._climate, this._height, fertilityNoise);
		this._terrain = _determineTerrain(this._height, this._climate);
		this._vegetation = _determineVegetation(this._height, this._climate, this._fertility);
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
		this._drawImage(ctx, displayX, displayY, tileSize, tileAtlases[0], _getTerrainImageData(this._terrain));
		this._drawImage(ctx, displayX, displayY, tileSize, tileAtlases[1], _getVegetationImageData(this._vegetation));
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