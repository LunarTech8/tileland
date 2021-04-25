class Array2D {
    constructor(sizeX, sizeY) {
        this.data = new Array(sizeX * sizeY);
        this.sizeX = sizeX;
        this.sizeY = sizeY;
    }
    checkBoundaries(x, y) {
        if (!Utilities.isInRect([x, y], 0, 0, this.sizeX, this.sizeY)) {
            throw new Error('Slot (' + x + '/' + y + ') is outside boundaries (0-' + (this.sizeX - 1) + '/0-' + (this.sizeY - 1) + ')');
        }
    }
    toArraySlot(x, y) {
        return x + this.sizeX * y;
    }
    get(x, y) {
        this.checkBoundaries(x, y);
        return this.data[this.toArraySlot(x, y)];
    }
    set(x, y, elem) {
        this.checkBoundaries(x, y);
        this.data[this.toArraySlot(x, y)] = elem;
    }
}
