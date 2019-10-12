const Card = require('../../Card.js');

class MushroomMan extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyPower(() => ((3 - this.controller.getForgedKeys()) * 3))
        });
    }
}

MushroomMan.id = 'mushroom-man'; // This is a guess at what the id might be - please check it!!!

module.exports = MushroomMan;
