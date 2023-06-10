const Card = require('../../Card.js');

class MushroomMan extends Card {
    // Mushroom Man gets +3 power for each unforged key you have.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower((card) => (3 - card.controller.getForgedKeys()) * 3)
        });
    }
}

MushroomMan.id = 'mushroom-man';

module.exports = MushroomMan;
