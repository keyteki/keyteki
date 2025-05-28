const Card = require('../../Card.js');

class ExoticPivot extends Card {
    // Play: Discard the top card of your deck. If it is not a Logos card, steal 3.
    // Fate: For the remainder of the turn, you cannot play creatures.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck.length > 0 ? context.player.deck[0] : null
            })),
            then: {
                condition: (context) => !context.preThenEvent.card.hasHouse('logos'),
                gameAction: ability.actions.steal({ amount: 3 })
            }
        });

        this.fate({
            effect: 'prevent creatures from being played this turn',
            gameAction: ability.actions.lastingEffect({
                effect: ability.effects.playerCannot(
                    'play',
                    (context) => context.source.type === 'creature'
                ),
                effectAlert: true
            })
        });
    }
}

ExoticPivot.id = 'exotic-pivot';

module.exports = ExoticPivot;
