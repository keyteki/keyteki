import Card from '../../Card.js';

class WidespreadCorruption extends Card {
    // After a player gains A by reaping, a creature they do not control captures that A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onModifyAmber: (event, context) => event.reap && context.game.activePlayer.opponent
            },
            target: {
                cardType: 'creature',
                cardCondition: (card, context) =>
                    card.controller === context.game.activePlayer.opponent,
                gameAction: ability.actions.sequential([
                    ability.actions.capture((context) => ({
                        amount: context.event.amount,
                        player: context.game.activePlayer
                    })),
                    ability.actions.changeEvent((context) => ({
                        event: context.event,
                        amount:
                            context.game.activePlayer &&
                            context.game.activePlayer.anyEffect('captureFromPool')
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

export default WidespreadCorruption;
