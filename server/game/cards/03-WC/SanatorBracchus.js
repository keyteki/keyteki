const Card = require('../../Card.js');

class SanatorBracchus extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.keyAmber(this)
        });

        this.fight({
            reap: true,
            gameAction: ability.actions.exalt()
        });
    }
}

SanatorBracchus.id = 'senator-bracchus';

module.exports = SanatorBracchus;
