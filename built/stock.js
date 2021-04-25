class Ware {
    constructor(wareType, count) {
        this.wareType = wareType;
        this.count = count;
    }
    hasSameType(ware) {
        return wareType == ware.wareType;
    }
}
// --------------------
// Data code
// --------------------
Ware.WareType = Object.freeze({
    WOOD: "wood",
    STONE: "stone",
    METAL: "metal",
    FOOD: "food",
    IRON_ORE: "iron ore",
    COAL: "coal",
    WOODEN_BOARDS: "wooden boards",
    WOODEN_STICKS: "wooden sticks",
    STRAW: "straw",
});
class Stock {
    constructor(wares) {
        if (wares instanceof LinkedList == false) {
            throw new Error('Invalid type for parameter "wares" (has to be of class LinkedList)');
        }
        this._wares = wares;
    }
    /** Returns if the stock has no wares. */
    isEmpty() {
        this._wares.size() == 0;
    }
    /** Returns the ware by given index of the stock. */
    getWare(index) {
        if (index >= wares.size()) {
            throw new Error('Index has to be smaller than list size');
        }
        return wares.get(index);
    }
    /** Returns the last ware of the stock. */
    getLastWare() {
        return wares.peek();
    }
    /** Returns amount of different ware types in the stock. */
    getAmountOfWareTypes() {
        return wares.size();
    }
    /** Returns count of given ware type. */
    getWareCount(wareType) {
        for (iWare of this._wares) {
            if (iWare.wareType == wareType) {
                return iWare.count;
            }
        }
        return 0;
    }
    /** Returns if the stock has the given ware. */
    hasWare(ware) {
        for (iWare of this._wares) {
            if (iWare.hasSameType(ware)) {
                // Check ware:
                if (iWare.count >= ware.count) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        return false;
    }
    /** Add given wares to the stock. */
    addWare(ware) {
        // Adjust ware:
        for (iWare of this._wares) {
            if (iWare.hasSameType(ware)) {
                iWare.count += ware.count;
                return;
            }
        }
        // Add new ware if none exists of that type yet:
        this._wares.add(ware);
    }
    /** Add given wares to the stock. */
    addWares(wares) {
        for (iWare of wares) {
            this.addWare(iWare);
        }
    }
}
// --------------------
// Test code
// --------------------
var StockTest = {};
StockTest.addAndRemove = function () {
    // FIXME: implement UnitTest class with assert functions and create test command that calls this function
    let testName = setTestName("StockTest.addAndRemove");
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
};
