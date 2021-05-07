import { Stock, Ware } from '../src/stock';
import { LinkedList } from '../src/linkedList';
​

// --------------------
// Test code
// --------------------

test('Stock.addAndRemove', () =>
{
	// Create new stock and check content:
	let stockA = new Stock(new LinkedList<Ware>());
	expect(stockA.isEmpty()).toBe(true);
	expect(stockA.getAmountOfWareTypes()).toBe(0);
	// Add wares and check content:
	stockA.addWare(new Ware(Ware.WareType.FOOD, 2));
	stockA.addWare(new Ware(Ware.WareType.STONE, 2));
	stockA.addWare(new Ware(Ware.WareType.STRAW, 1));
	stockA.addWare(new Ware(Ware.WareType.FOOD, 1));
	expect(stockA.isEmpty()).toBe(false);
	expect(stockA.getAmountOfWareTypes()).toBe(3);
	expect(stockA.getWareCount(Ware.WareType.FOOD)).toBe(3);
	expect(stockA.getLastWare().wareType == Ware.WareType.STRAW).toBe(true);
	expect(stockA.getWare(0).wareType == Ware.WareType.FOOD).toBe(true);
	expect(stockA.getWare(1).wareType == Ware.WareType.STONE).toBe(true);
	expect(stockA.hasWare(new Ware(Ware.WareType.STONE, 3))).toBe(false);
	expect(stockA.hasWare(new Ware(Ware.WareType.STONE, 2))).toBe(true);
	// TODO: continue implementation
});