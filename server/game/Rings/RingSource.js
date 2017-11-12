const EffectSource = require('../EffectSource.js');

const capitalize = {
    military: 'Military',
    political: 'Political',
    air: 'Air',
    water: 'Water',
    earth: 'Earth',
    fire: 'Fire',
    void: 'Void'
};

class RingSource extends EffectSource {
    constructor(player, ring) {
        super();
        this.controller = player;
        this.ring = ring;
        this.element = ring.element;
        this.conflictType = ring.conflictType;
        this.name = capitalize[ring.element] + ' Ring';
        this.id = this.name;
        this.factions = {};
        this.type = 'ring';
    }
}

module.exports = RingSource;
