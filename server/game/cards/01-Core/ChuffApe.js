const Card = require('../../Card.js');

class ChuffApe extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.entersPlayStunned()
        });

        this.fight({
            reap: true,
            optional: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card, context) => card !== context.source,
                gameAction: ability.actions.sacrifice()
            },
            effect: 'sacrifice {0} and fully heal itself',
            then: {
                gameAction: ability.actions.heal({ fully: true })
            }
        });
    }
}

ChuffApe.id = 'chuff-ape';

module.exports = ChuffApe;
