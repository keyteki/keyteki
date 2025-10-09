const Card = require('../../Card.js');

class SignalFire extends Card {
    // Omni: Sacrifice Signal Fire. For the remainder of the turn, friendly Brobnar creatures may fight as though they belonged to the active house.
    setupCardAbilities(ability) {
        this.omni({
            effect: 'allow all friendly brobnar creatures to only fight this turn',
            gameAction: [
                ability.actions.sacrifice(),
                ability.actions.forRemainderOfTurn({
                    effect: [
                        ability.effects.canUse(
                            (card) => card.type === 'creature' && card.hasHouse('brobnar')
                        ),
                        ability.effects.cardCannot(
                            'useAction',
                            (context) =>
                                context.source.type === 'creature' &&
                                context.source.hasHouse('brobnar') &&
                                context.ability.title !== 'Fight with this creature'
                        ),
                        ability.effects.cardCannot('reap', (context) =>
                            context.source.hasHouse('brobnar')
                        )
                    ]
                })
            ]
        });
    }
}

SignalFire.id = 'signal-fire';

module.exports = SignalFire;
