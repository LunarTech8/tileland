import {LinkedList} from '../src/linkedList';


// --------------------
// Functional code
// --------------------

export class Ware
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

export class Stock
{
	private wares: LinkedList<Ware>;

	constructor(wares: LinkedList<Ware>)
	{
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
				if (iWare.count >= ware.count)
				{
					return true;
				}
				else
				{
					return false;
				}
			}
		}
		return false;
	}

	/** Returns if the stock has the given wares. */
	public hasWares(wares: LinkedList<Ware>): boolean
	{
		for (let iWare of wares)
		{
			if (this.hasWare(iWare) == false)
			{
				return false;
			}
		}
		return true;
	}

	/** Returns if the stock has any of the given wares. */
	public hasWaresAny(wares: LinkedList<Ware>): boolean
	{
		for (let iWare of wares)
		{
			if (this.getWareCount(iWare.wareType) > 0)
			{
				return true;
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

	/** Remove given ware from the stock. */
	public removeWare(w: Ware)
	{
		for (let iWare of this.wares)
		{
			if (iWare.hasSameType(w))
			{
				// Check and adjust ware:
				if (iWare.count <= w.count)
				{
					this.wares.remove(iWare);
				}
				else
				{
					iWare.count -= w.count;
				}
			}
		}
	}

	/** Remove given wares from the stock. */
	public removeWares(wares: LinkedList<Ware>)
	{
		for (let iWare of wares)
		{
			this.removeWare(iWare);
		}
	}

	/** Returns if the stock has any wares of given target stock. */
	public containsAny(targetStock: Stock): boolean
	{
		for (let iWare of this.wares)
		{
			if (targetStock.getWareCount(iWare.wareType) > 0)
			{
				return true;
			}
		}
		return false;
	}
}


// --------------------
// Data code
// --------------------

export namespace Ware
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