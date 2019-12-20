const Card = require('../../Card.js');

class Noname extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyPower(() => this.controller.purged.length + (this.controller.opponent ? this.controller.opponent.purged.length : 0))
        });
        this.play({
            fight: true,
            reap: true,
            target: {
                mode: 'exactly',
                numCards: 1,
                location: 'discard',
                gameAction: ability.actions.purge()
            }
        });
    }
}

Noname.id = 'noname';

module.exports = Noname;
