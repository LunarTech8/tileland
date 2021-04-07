
class Settlement
{
	// --------------------
	// Data code
	// --------------------

	static Level = Object.freeze
	({
		HOMESTEAD: 1,
		VILLAGE: 2,
		TOWN: 3,
		CITY: 4,
		METROPOLIS: 5,
	});


	// --------------------
	// Functional code
	// --------------------

	_buildings;
	_resources;

	constructor(startBuilding)
	{
		_buildings = [startBuilding];
	}

	addBuilding(building)
	{
		_buildings.push(building);
	}
}