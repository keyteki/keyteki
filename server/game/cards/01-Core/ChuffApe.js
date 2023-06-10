const Card = require('../../Card.js');

class ChuffApe extends Card {
    // Taunt. (This creatures neighbors cannot be attacked unless they have taunt.)
    // Chuff Ape enters play stunned.
    // Fight/Reap: You may sacrifice another friendly creature. If you do, fully heal Chuff Ape.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.entersPlayStunned()
        });

        this.fight({
            reap: true,
            target: {
                optional: true,
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
