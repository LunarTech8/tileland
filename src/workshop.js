class Workshop extends Building
{
	// --------------------
	// Data code
	// --------------------

	static _determineRequiredWorkPower = function(buildingName, productionVariant)
	{
		switch (buildingName)
		{
			case "Lumbermill":
				if (productionVariant == 1) { return 3; }
				else if (productionVariant == 2) { return 2; }
				throw new Error('Invalid production variant (' + productionVariant + ')');
			default:
				throw new Error('Unrecognized given building name (' + buildingName + ')');
		}
	};


	// --------------------
	// Functional code
	// --------------------

	_productionVariant;
	_workProgressCurrent;
	_workProgressFinished;
	_workPower;

	constructor(buildingName)
	{
		super.constructor(buildingName);
		this._productionVariant = 1;
		this._workProgressCurrent = 0;
		this._workProgressFinished = _determineRequiredWorkPower(buildingName, this._productionVariant);
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
		this._workPower = _determineWorkPower(this._name, this._workerCount.length);
	}
}