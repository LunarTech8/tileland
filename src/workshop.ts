import { Building } from "./building.js";


// --------------------
// Functional code
// --------------------

export class Workshop extends Building
{
	private productionVariant: number;
	private workProgressCurrent: number;
	private workProgressFinished: number;
	private workPower: number;

	constructor(buildingName: string)
	{
		super(buildingName);
		this.productionVariant = 1;
		this.workProgressCurrent = 0;
		this.workProgressFinished = determineRequiredWorkPower(buildingName, this.productionVariant);
		this.workPower = 0;
	}

	private adjustWorkPower()
	{
		this.workPower = this.workerCount;
	}

	public addWorker()
	{
		super.addWorker();
		this.adjustWorkPower();
	}

	public removeWorker()
	{
		super.removeWorker();
		this.adjustWorkPower();
	}
}


// --------------------
// Data code
// --------------------

export enum Level
{
	HOMESTEAD,
	VILLAGE,
	TOWN,
	CITY,
	METROPOLIS,
}

function determineRequiredWorkPower(buildingName: string, productionVariant: number): number
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
}