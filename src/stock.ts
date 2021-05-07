// --------------------
// Functional code
// --------------------

class Ware
{
	public wareType: Ware.WareType;
	public count: number;

	constructor(wareType: Ware.WareType, count: number)
	{
		this.wareType = wareType;
		this.count = count;
	}

	public hasSameType(ware: Ware): boolean
	{
		return this.wareType == ware.wareType;
	}
}

class Stock
{
	private wares: LinkedList<Ware>;

	constructor(wares: LinkedList<Ware>)
	{
		if (wares instanceof LinkedList == false)
		{
			throw new Error('Invalid type for parameter "wares" (has to be of class LinkedList)');
		}
		this.wares = wares;
	}

	/** Returns if the stock has no wares. */
	public isEmpty(): boolean
	{
		return this.wares.size() == 0;
	}

	/** Returns the ware by given index of the stock. */
	public getWare(index: number): Ware
	{
		if (index >= this.wares.size())
		{
			throw new Error('Index has to be smaller than list size');
		}
		return this.wares.get(index);
	}

	/** Returns the last ware of the stock. */
	public getLastWare(): Ware
	{
		return this.wares.peek();
	}

	/** Returns amount of different ware types in the stock. */
	public getAmountOfWareTypes(): number
	{
		return this.wares.size();
	}

	/** Returns count of given ware type. */
	public getWareCount(wareType: Ware.WareType): number
	{
		for (let iWare of this.wares)
		{
			if (iWare.wareType == wareType)
			{
				return iWare.count;
			}
		}
		return 0;
	}

	/** Returns if the stock has the given ware. */
	public hasWare(ware: Ware): boolean
	{
		for (let iWare of this.wares)
		{
			if (iWare.hasSameType(ware))
			{
				// Check ware:
				if (iWare.count >= ware.count) { return true; }
				else { return false; }
			}
		}
		return false;
	}

	/** Add given wares to the stock. */
	public addWare(ware: Ware)
	{
		// Adjust ware:
		for (let iWare of this.wares)
		{
			if (iWare.hasSameType(ware))
			{
				iWare.count += ware.count;
				return;
			}
		}
		// Add new ware if none exists of that type yet:
		this.wares.add(ware);
	}

	/** Add given wares to the stock. */
	public addWares(wares: any)
	{
		for (let iWare of wares)
		{
			this.addWare(iWare);
		}
	}

	// TODO: continue implementation
}

// --------------------
// Data code
// --------------------

namespace Ware
{
	export enum WareType
	{
		WOOD = "wood",
		STONE = "stone",
		METAL = "metal",
		FOOD = "food",
		IRON_ORE = "iron ore",
		COAL = "coal",
		WOODEN_BOARDS = "wooden boards",
		WOODEN_STICKS = "wooden sticks",
		STRAW = "straw"
	}
}

// --------------------
// Test code
// --------------------

namespace Ware
{
	export function addAndRemove()
	{
		// FIXME: implement UnitTest class with assert functions and create test command that calls this function
		let testName = setTestName("StockTest.addAndRemove")
		// Create new stock and check content:
		let stockA = new Stock(new LinkedList());
		stockA.isEmpty().assertTrue(testName);
		stockA.getAmountOfWareTypes().assertEquals(testName, 0);
		// Add wares and check content:
		stockA.addWare(new Ware(Ware.WareType.FOOD, 2));
		stockA.addWare(new Ware(Ware.WareType.STONE, 2));
		stockA.addWare(new Ware(Ware.WareType.STRAW, 1));
		stockA.addWare(new Ware(Ware.WareType.FOOD, 1));
		stockA.isEmpty().assertFalse(testName);
		stockA.getAmountOfWareTypes().assertEquals(testName, 3);
		stockA.getWareCount(Ware.WareType.FOOD).assertEquals(testName, 3);
		(stockA.getLastWare().wareType == Ware.WareType.STRAW).assertTrue(testName);
		(stockA.getWare(0).wareType == Ware.WareType.FOOD).assertTrue(testName);
		(stockA.getWare(1).wareType == Ware.WareType.STONE).assertTrue(testName);
		stockA.hasWare(new Ware(Ware.WareType.STONE, 3)).assertFalse(testName);
		stockA.hasWare(new Ware(Ware.WareType.STONE, 2)).assertTrue(testName);
		// TODO: continue implementation
	}
}