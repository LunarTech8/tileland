// --------------------
// Data code
// --------------------

const HEIGHT_MIN = -2000;  // In meters
const HEIGHT_MAX = 4000;  // In meters

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
	if (latitudeFactor >= 0.45 || latitudeFactor <= 0.55) { return Climate.hot; }
	else if (latitudeFactor >= 0.35 || latitudeFactor <= 0.65) { return Climate.warm; }
	else if (latitudeFactor >= 0.15 || latitudeFactor <= 0.85) { return Climate.mild; }
	else if (latitudeFactor >= 0.05 || latitudeFactor <= 0.95) { return Climate.cold; }
	else if (latitudeFactor >= 0.00 || latitudeFactor <= 1.00) { return Climate.icy; }
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
		this._height = Utilities.interpolateLinear(HEIGHT_MIN, HEIGHT_MAX, heightNoise);
		this._climate = _determineClimate(latitudeFactor);
		this._fertility = _determineFertility(this._climate, this._height, fertilityNoise);
		this._terrain = _determineTerrain(this._height, this._climate);
		this._vegetation = _determineTerrain(this._height, this._climate, this._fertility);
	}

	get terrain()
	{
		return this._terrain;
	}

	get vegetation()
	{
		return this._vegetation;
	}
}