const Card = require('../../Card.js');

class ThingFromTheDeep extends Card {
    // Thing from the Deep cannot be played unless Open the Seal is in your discard pile.
    // After Fight: Steal 2.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.cardCannot(
                'play',
                (context) => !context.player.discard.some((card) => card.id === 'open-the-seal')
            )
        });

        this.fight({
            effect: 'steal 2A from {1}',
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.steal({ amount: 2 })
        });
    }
}

ThingFromTheDeep.id = 'thing-from-the-deep';

module.exports = ThingFromTheDeep;
