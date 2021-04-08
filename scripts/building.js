class Building
{
	// --------------------
	// Data code
	// --------------------

	static Type = Object.freeze
	({
		RESOURCE: 1,
		PRODUCTION: 2,
		HOUSING: 3,
		PUBLIC: 4,
		SPECIAL: 5,
	});

	static _determineType = function(buildingName)
	{
		switch (buildingName)
		{
			case "VillageSquare":
				return Building.Type.PUBLIC;
			case "WoodcutterHut":
				return Building.Type.RESOURCE;
			case "Lumbermill":
				return Building.Type.PRODUCTION;
			case "PeasantHouse":
				return Building.Type.HOUSING;
			default:
				throw new Error('Unrecognized given building name (' + buildingName + ')');
		}
	};


	// --------------------
	// Functional code
	// --------------------

	_name;
	_workerCount;
	_resources;

	constructor(buildingName)
	{
		this._name = buildingName;
	}

	addWorker()
	{
		this._workerCount++;
	}

	removeWorker()
	{
		this._workerCount--;
	}
}