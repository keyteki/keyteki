const Card = require('../../Card.js');

class Gebuk extends Card {
    // Destroyed: Discard the top card of your deck. If it is a creature, after Gebuk leaves play, put that creature into play in Gebuks position in the battleline.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck[0]
            })),
            then: (thenContext) => ({
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    target: thenContext.event.card,
                    duration: 'lastingEffect',
                    effect: ability.effects.lastingAbilityTrigger({
                        when: {
                            onCardLeavesPlay: (event, context) => event.card === context.source
                        },
                        gameAction: ability.actions.putIntoPlay({
                            target:
                                context.preThenEvent.card.type === 'creature' &&
                                !context.preThenEvent.card.gigantic
                                    ? context.preThenEvent.card
                                    : [],
                            deployIndex: thenContext.event.battlelineIndex
                        })
                    })
                }))
            })
        });
    }
}

Gebuk.id = 'gebuk';

module.exports = Gebuk;
