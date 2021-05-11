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
	stockA.addWare(new Ware(Ware.Type.FOOD, 2));
	stockA.addWare(new Ware(Ware.Type.STONE, 2));
	stockA.addWare(new Ware(Ware.Type.STRAW, 1));
	stockA.addWare(new Ware(Ware.Type.FOOD, 1));
	expect(stockA.isEmpty()).toBe(false);
	expect(stockA.getAmountOfWareTypes()).toBe(3);
	expect(stockA.getWareCount(Ware.Type.FOOD)).toBe(3);
	expect(stockA.getLastWare().wareType == Ware.Type.STRAW).toBe(true);
	expect(stockA.getWare(0).wareType == Ware.Type.FOOD).toBe(true);
	expect(stockA.getWare(1).wareType == Ware.Type.STONE).toBe(true);
	expect(stockA.hasWare(new Ware(Ware.Type.STONE, 3))).toBe(false);
	expect(stockA.hasWare(new Ware(Ware.Type.STONE, 2))).toBe(true);
	// Remove wares and check content:
	stockA.removeWare(new Ware(Ware.Type.FOOD, 2));
	stockA.removeWare(new Ware(Ware.Type.STONE, 2));
	expect(stockA.getAmountOfWareTypes()).toBe(2);
	expect(stockA.getWareCount(Ware.Type.FOOD)).toBe(1);
	// Create another storage and check content:
	let stockB = new Stock(new LinkedList<Ware>());
	expect(stockB.isEmpty()).toBe(true);
	expect(stockB.getAmountOfWareTypes()).toBe(0);
	// Add wares and check content:
	let waresA = new LinkedList<Ware>();
	waresA.add(new Ware(Ware.Type.FOOD, 2));
	waresA.add(new Ware(Ware.Type.STONE, 3));
	waresA.add(new Ware(Ware.Type.STRAW, 1));
	waresA.add(new Ware(Ware.Type.WOOD, 6));
	expect(stockB.hasWaresAny(waresA)).toBe(false);
	expect(stockB.containsAny(stockA)).toBe(false);
	stockB.addWares(waresA);
	expect(stockB.isEmpty()).toBe(false);
	expect(stockB.getAmountOfWareTypes()).toBe(4);
	expect(stockB.hasWares(waresA)).toBe(true);
	expect(stockB.containsAny(stockA)).toBe(true);
	// Remove wares and check content:
	let waresB = new LinkedList<Ware>();
	waresB.add(new Ware(Ware.Type.FOOD, 3));
	waresB.add(new Ware(Ware.Type.WOOD, 1));
	stockB.removeWares(waresB);
	expect(stockB.isEmpty()).toBe(false);
	expect(stockB.getAmountOfWareTypes()).toBe(3);
	expect(stockB.getWareCount(Ware.Type.FOOD)).toBe(0);
	expect(stockB.getWareCount(Ware.Type.WOOD)).toBe(5);
	expect(stockB.hasWares(waresB)).toBe(false);
	expect(stockB.hasWaresAny(waresB)).toBe(true);
});