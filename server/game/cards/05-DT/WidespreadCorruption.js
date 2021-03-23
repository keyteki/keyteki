const Card = require('../../Card.js');

class WidespreadCorruption extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onModifyAmber: (event, context) => event.reap && context.player.opponent
            },
            target: {
                cardType: 'creature',
                cardCondition: (card, context) => card.controller === context.player.opponent,
                gameAction: ability.actions.sequential([
                    ability.actions.capture((context) => ({
                        amount: context.event.amount,
                        player: context.player
                    })),
                    ability.actions.changeEvent((context) => ({
                        event: context.event,
                        amount:
                            context.source.controller.opponent &&
                            context.source.controller.opponent.anyEffect('captureFromPool')
                                ? 1
                                : 0,
                        cancel: false
                    }))
                ])
            },
            effect: 'capture 1 amber on {1}'
        });
    }
}

WidespreadCorruption.id = 'widespread-corruption';

module.exports = WidespreadCorruption;
