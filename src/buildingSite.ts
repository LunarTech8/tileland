import { Building } from "./building";


// --------------------
// Functional code
// --------------------

export class BuildingSite extends Building
{
	private workProgressCurrent: number;
	private workProgressFinished: number;
	private workPower: number;

	constructor(buildingName: string)
	{
		super(buildingName);
		this.workProgressCurrent = 0;
		this.workProgressFinished = determineRequiredWorkPower(buildingName);
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

function determineRequiredWorkPower(buildingName: string): number
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
}