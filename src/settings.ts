
export class Settings
{
	// --------------------
	// Functional code
	// --------------------

	heightMin: number;  // In meters
	heightMax: number;  // In meters
	waterPercentage: number;
	flatnessFactorLowlands: number;  // 0 = No flattening, 1 = Max flattening towards lowlands
	flatnessFactorHighlands: number;  // 0 = No flattening, 1 = Max flattening towards highlands
	mapPerlinNoiseOctaves: number;
	mapTilesX: number;
	mapTilesY: number;

	constructor(mapType: MapType, mapSize: MapSize)
	{
		setSettingValues(this, mapType, mapSize);
	}
}


// --------------------
// Data code
// --------------------

export enum MapType
{
	TEST,
	SMALL_CONTINENTS,
	LARGE_CONTINENTS,
	ARCHIPELAGOS,
	PANGAEA,
	CENTRAL_OCEAN,
	CENTRAL_DESERT,
}

export enum MapSize
{
	TINY,
	SMALL,
	MEDIUM,
	LARGE,
	HUGE,
}

function setSettingValues(settings: Settings, mapType: MapType, mapSize: MapSize)
{
	switch (mapType)
	{
		case MapType.TEST:
			settings.heightMin = -2000;
			settings.heightMax = 4000;
			settings.waterPercentage = 0.3;
			settings.flatnessFactorLowlands = 0.2;
			settings.flatnessFactorHighlands = 0.2;
			break;
		case MapType.SMALL_CONTINENTS:
			settings.heightMin = -2000;
			settings.heightMax = 4000;
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
		case MapSize.TINY:
			settings.mapPerlinNoiseOctaves = 5;
			settings.mapTilesX = 64;
			settings.mapTilesY = 64;
			break;
		case MapSize.MEDIUM:
			settings.mapPerlinNoiseOctaves = 6;
			settings.mapTilesX = 512;
			settings.mapTilesY = 512;
			break;
		// TODO: define other map sizes
		default:
			throw new Error('Invalid given map size (' + mapSize + ')');
	}
}