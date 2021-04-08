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

	static _determineLevel = function(buildingCount)
	{
		if (buildingCount <= 5) { return Settlement.Level.HOMESTEAD; }
		else if (buildingCount <= 15) { return Settlement.Level.VILLAGE; }
		else if (buildingCount <= 30) { return Settlement.Level.TOWN; }
		else if (buildingCount <= 50) { return Settlement.Level.CITY; }
		else { return Settlement.Level.METROPOLIS; }
	};


	// --------------------
	// Functional code
	// --------------------

	_buildings;
	_workers;
	_resources;
	_level;

	constructor(startBuilding)
	{
		this._buildings = [startBuilding];
	}

	addBuilding(building)
	{
		this._buildings.push(building);
		this._adjustLevel();
	}

	_adjustLevel()
	{
		this._level = _determineLevel(this._buildings.length);
	}
}