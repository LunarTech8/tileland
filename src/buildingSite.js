class BuildingSite extends Building
{
	// --------------------
	// Data code
	// --------------------

	static _determineRequiredWorkPower = function(buildingName)
	{
		switch (buildingName)
		{
			case "VillageSquare":
				return 15;
			case "WoodcutterHut":
				return 10;
			case "Lumbermill":
				return 15;
			case "PeasantHouse":
				return 10;
			default:
				throw new Error('Unrecognized given building name (' + buildingName + ')');
		}
	};


	// --------------------
	// Functional code
	// --------------------

	_workProgressCurrent;
	_workProgressFinished;
	_workPower;

	constructor(buildingName)
	{
		super.constructor(buildingName);
		this._workProgressCurrent = 0;
		this._workProgressFinished = _determineRequiredWorkPower(buildingName);
		this._workPower = _adjustWorkPower();
	}

	addWorker()
	{
		super.addWorker();
		this._adjustWorkPower();
	}

	removeWorker()
	{
		super.removeWorker();
		this._adjustWorkPower();
	}

	_adjustWorkPower()
	{
		this._workPower = this._workerCount;
	}
}