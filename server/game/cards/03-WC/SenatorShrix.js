const Card = require('../../Card.js');

class SenatorShrix extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.keyAmber()
        });

        this.play({
            reap: true,
            optional: true,
            gameAction: ability.actions.exalt(context => ({
                target: context.source
            }))
        });
    }
}

SenatorShrix.id = 'senator-shrix';

module.exports = SenatorShrix;
