import { LinkedList } from "./linkedList.js";
import { Stock, Ware } from "./stock.js";


// --------------------
// Functional code
// --------------------

export class Building
{
	protected name: string;
	protected workerCount: number;
	protected resources: Stock;

	constructor(buildingName: string)
	{
		this.name = buildingName;
		this.resources = new Stock(new LinkedList<Ware>());
	}

	public addWorker()
	{
		this.workerCount++;
	}

	public removeWorker()
	{
		this.workerCount--;
	}
}


// --------------------
// Data code
// --------------------

export enum Type
{
	RESOURCE,
	PRODUCTION,
	HOUSING,
	PUBLIC,
	SPECIAL,
};

function determineType(buildingName: string): Type
{
	switch (buildingName)
	{
		case "VillageSquare":
			return Type.PUBLIC;
		case "WoodcutterHut":
			return Type.RESOURCE;
		case "Lumbermill":
			return Type.PRODUCTION;
		case "PeasantHouse":
			return Type.HOUSING;
		default:
			throw new Error('Unrecognized given building name (' + buildingName + ')');
	}
};