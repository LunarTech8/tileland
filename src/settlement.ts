import { Stock } from "./stock";


// --------------------
// Functional code
// --------------------

class Settlement
{
	private buildings: Building[];
	private workers: any[];
	private resources: Stock;
	private level: Settlement.Level;

	constructor(startBuilding: Building)
	{
		this.buildings = [startBuilding];
	}

	private adjustLevel()
	{
		this.level = Settlement.determineLevel(this.buildings.length);
	}

	public addBuilding(building: Building)
	{
		this.buildings.push(building);
		this.adjustLevel();
	}
}


// --------------------
// Data code
// --------------------

namespace Settlement
{
	export enum Level
	{
		HOMESTEAD,
		VILLAGE,
		TOWN,
		CITY,
		METROPOLIS
	}

	export function determineLevel(buildingCount: number): Level
	{
		if (buildingCount <= 5) { return Level.HOMESTEAD; }
		else if (buildingCount <= 15) { return Level.VILLAGE; }
		else if (buildingCount <= 30) { return Level.TOWN; }
		else if (buildingCount <= 50) { return Level.CITY; }
		else { return Level.METROPOLIS; }
	}
}