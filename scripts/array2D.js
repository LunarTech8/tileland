// --------------------
// Prototypes
// --------------------

class Array2D
{
	data;
	sizeX;
	sizeY;

	constructor(sizeX, sizeY)
	{
		this.data = new Array(sizeX * sizeY);
		this.sizeX = sizeX;
		this.sizeY = sizeY;
	}

	_checkBoundaries(x, y)
	{
		if (x >= this.sizeX || x < 0 || y >= this.sizeY || y < 0)
		{
			throw new Error('Slot (' + x + '/' + y + ') is outside boundaries (0-' + (this.sizeX - 1) + '/0-' + (this.sizeY - 1) + ')');
		}
	}

	_toArraySlot(x, y)
	{
		return x + this.sizeX * y;
	}

	get(x, y)
	{
		this._checkBoundaries(x, y);
		return this.data[this._toArraySlot(x, y)];
	}

	set(x, y, elem)
	{
		this._checkBoundaries(x, y);
		this.data[this._toArraySlot(x, y)] = elem;
	}
}