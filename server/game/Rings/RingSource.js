const capitalize = {
    military: 'Military',
    political: 'Political',
    air: 'Air',
    water: 'Water',
    earth: 'Earth',
    fire: 'Fire',
    void: 'Void'
};

class RingSource {
    constructor(player, ring) {
        this.controller = player;
        this.ring = ring;
        this.element = ring.element;
        this.conflictType = ring.conflictType;
        this.name = capitalize[ring.element] + ' Ring';
        this.id = this.name;
        this.factions = {};
        this.type = 'ring';
    }

    isUnique() {
        return false;
    }

    isBlank() {
        return false;
    }

    getType() {
        return this.type;
    }

    getPrintedFaction() {
        return null;
    }

    hasKeyword() {
        return false;
    }

    hasTrait() {
        return false;
    }
            
    isFaction() {
        return false;
    }
            
    hasToken() {
        return false;
    }
            
    getShortSummary() {
        return {
            id: this.id,
            label: this.name,
            name: this.name,
            type: this.getType()
        };
    }

}

module.exports = RingSource;
