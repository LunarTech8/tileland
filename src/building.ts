import { Stock } from "./stock";


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

export namespace Building
{
	export enum Type
	{
		RESOURCE,
		PRODUCTION,
		HOUSING,
		PUBLIC,
		SPECIAL,
	};

	export function determineType(buildingName: string): Type
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
}