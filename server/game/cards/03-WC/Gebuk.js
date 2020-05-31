const Card = require('../../Card.js');

class Gebuk extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck[0]
            })),
            then: (thenContext) => ({
                gameAction: ability.actions.cardLastingEffect({
                    target: thenContext.event.card,
                    duration: 'lastingEffect',
                    effect: ability.effects.delayedEffect({
                        when: {
                            onCardLeavesPlay: (event) => event.card === thenContext.source
                        },
                        gameAction: ability.actions.putIntoPlay((context) => ({
                            target:
                                context.preThenEvent.card.type === 'creature'
                                    ? context.preThenEvent.card
                                    : [],
                            deployIndex: context.event.battlelineIndex
                        }))
                    })
                })
            })
        });
    }
}

Gebuk.id = 'gebuk';

module.exports = Gebuk;
