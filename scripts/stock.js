class Stock
{
	// --------------------
	// Data code
	// --------------------

	static WareType = Object.freeze
	({
		WOOD: 1,
		STONE: 2,
		METAL: 3,
		FOOD: 4,
		IRON_ORE: 5,
		COAL: 6,
		WOODEN_BOARDS: 7,
		WOODEN_STICKS: 8,
		STRAW: 9,
	});


	// --------------------
	// Functional code
	// --------------------

	_wares;

	constructor(wares)
	{
		this._wares = new LinkedList();
	}

	isEmpty()
	{
		this._wares.size() == 0;
	}
}