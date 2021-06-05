import { LinkedList } from "./linkedList.js";
import { Stock, Ware } from "./stock.js";
import { Building } from "./building.js";


// --------------------
// Functional code
// --------------------

export class Settlement
{
	private buildings: Building[];
	private workers: any[];
	private resources: Stock;
	private level: Level;

	constructor(startBuilding: Building)
	{
		this.buildings = [startBuilding];
		this.resources = new Stock(new LinkedList<Ware>());
	}

	private adjustLevel()
	{
		this.level = determineLevel(this.buildings.length);
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

export enum Level
{
	HOMESTEAD,
	VILLAGE,
	TOWN,
	CITY,
	METROPOLIS,
}

function determineLevel(buildingCount: number): Level
{
	if (buildingCount <= 5) { return Level.HOMESTEAD; }
	else if (buildingCount <= 15) { return Level.VILLAGE; }
	else if (buildingCount <= 30) { return Level.TOWN; }
	else if (buildingCount <= 50) { return Level.CITY; }
	else { return Level.METROPOLIS; }
}