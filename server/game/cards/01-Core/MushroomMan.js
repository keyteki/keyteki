const Card = require('../../Card.js');

class MushroomMan extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower((card) => (3 - card.controller.getForgedKeys()) * 3)
        });
    }
}

MushroomMan.id = 'mushroom-man';

module.exports = MushroomMan;
