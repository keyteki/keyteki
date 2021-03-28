const Card = require('../../Card.js');

class SignalFire extends Card {
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
