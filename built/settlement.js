// --------------------
// Functional code
// --------------------
class Settlement {
    constructor(startBuilding) {
        this.buildings = [startBuilding];
    }
    adjustLevel() {
        this.level = Settlement.determineLevel(this.buildings.length);
    }
    addBuilding(building) {
        this.buildings.push(building);
        this.adjustLevel();
    }
}
// --------------------
// Data code
// --------------------
(function (Settlement) {
    let Level;
    (function (Level) {
        Level[Level["HOMESTEAD"] = 0] = "HOMESTEAD";
        Level[Level["VILLAGE"] = 1] = "VILLAGE";
        Level[Level["TOWN"] = 2] = "TOWN";
        Level[Level["CITY"] = 3] = "CITY";
        Level[Level["METROPOLIS"] = 4] = "METROPOLIS";
    })(Level = Settlement.Level || (Settlement.Level = {}));
    function determineLevel(buildingCount) {
        if (buildingCount <= 5) {
            return Level.HOMESTEAD;
        }
        else if (buildingCount <= 15) {
            return Level.VILLAGE;
        }
        else if (buildingCount <= 30) {
            return Level.TOWN;
        }
        else if (buildingCount <= 50) {
            return Level.CITY;
        }
        else {
            return Level.METROPOLIS;
        }
    }
    Settlement.determineLevel = determineLevel;
})(Settlement || (Settlement = {}));
