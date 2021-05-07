// --------------------
// Functional code
// --------------------

class Array2D<T>
{
	public data: T[];
	public sizeX: number;
	public sizeY: number;

	constructor(sizeX: number, sizeY: number)
	{
		this.data = new Array<T>(sizeX * sizeY);
		this.sizeX = sizeX;
		this.sizeY = sizeY;
	}

	private checkBoundaries(x: number, y: number)
	{
		if (!Utilities.isInRect([x, y], 0, 0, this.sizeX, this.sizeY))
		{
			throw new Error('Slot (' + x + '/' + y + ') is outside boundaries (0-' + (this.sizeX - 1) + '/0-' + (this.sizeY - 1) + ')');
		}
	}

	private toArraySlot(x: number, y: number): number
	{
		return x + this.sizeX * y;
	}

	public get(x: number, y: number): T
	{
		this.checkBoundaries(x, y);
		return this.data[this.toArraySlot(x, y)];
	}

	public set(x: number, y: number, elem: T)
	{
		this.checkBoundaries(x, y);
		this.data[this.toArraySlot(x, y)] = elem;
	}
}