const Card = require('../../Card.js');

class Berserker extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: [ability.effects.entersPlayReady(), ability.effects.entersPlayEnraged()]
        });
        this.fight({
            gameAction: ability.actions.destroy()
        });
    }
}

Berserker.id = 'berserker';

module.exports = Berserker;
