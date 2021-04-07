
class Settings
{
	// --------------------
	// Data code
	// --------------------

	static MapType = Object.freeze
	({
		TEST: 1,
		SMALL_CONTINENTS: 2,
		LARGE_CONTINENTS: 3,
		ARCHIPELAGOS: 4,
		PANGAEA: 5,
		CENTRAL_OCEAN: 6,
		CENTRAL_DESERT: 7,
	});

	static MapSize = Object.freeze
	({
		TINY: 1,
		SMALL: 2,
		MEDIUM: 3,
		LARGE: 4,
		HUGE: 5,
	});

	static _setSettingValues = function(settings, mapType, mapSize)
	{
		switch (mapType)
		{
			case Settings.MapType.TEST:
				settings.heightMin = -2000;
				settings.heightMax = 4000;
				settings.cliffMinDiff = 250;
				settings.waterPercentage = 0.3;
				settings.flatnessFactorLowlands = 0.2;
				settings.flatnessFactorHighlands = 0.2;
				break;
			case Settings.MapType.SMALL_CONTINENTS:
				settings.heightMin = -2000;
				settings.heightMax = 4000;
				settings.cliffMinDiff = 250;
				settings.waterPercentage = 0.55;
				settings.flatnessFactorLowlands = 0.2;
				settings.flatnessFactorHighlands = 0.2;
				break;
			// TODO: define other map types
			default:
				throw new Error('Invalid given map type (' + mapType + ')');
		}
		switch (mapSize)
		{
			case Settings.MapSize.TINY:
				settings.mapPerlinNoiseOctaves = 5;
				settings.mapTilesX = 64;
				settings.mapTilesY = 64;
				break;
				case Settings.MapSize.MEDIUM:
				settings.mapPerlinNoiseOctaves = 6;
				settings.mapTilesX = 512;
				settings.mapTilesY = 512;
				break;
			// TODO: define other map sizes
			default:
				throw new Error('Invalid given map size (' + mapSize + ')');
		}
	};


	// --------------------
	// Functional code
	// --------------------

	heightMin;  // In meters
	heightMax;  // In meters
	cliffMinDiff;  // In meters
	waterPercentage;
	flatnessFactorLowlands;  // 0 = No flattening, 1 = Max flattening towards lowlands
	flatnessFactorHighlands;  // 0 = No flattening, 1 = Max flattening towards highlands
	mapPerlinNoiseOctaves;
	mapTilesX;
	mapTilesY;

	constructor(mapType, mapSize)
	{
		Settings._setSettingValues(this, mapType, mapSize);
	}
}