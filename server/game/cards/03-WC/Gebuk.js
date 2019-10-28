const Card = require('../../Card.js');

class Gebuk extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: [
                ability.actions.discard(context => ({
                    target: context.player.deck[0]
                })),
                ability.actions.cardLastingEffect(c => ({
                    effect: ability.effects.gainAbility('interrupt', {
                        when: {
                            onCardLeavesPlay: (event, context) => event.card === context.source
                        },
                        gameAction: ability.actions.putIntoPlay(context => ({
                            target: context.player.discard[0],
                            deployIndex: context.player.creaturesInPlay.indexOf(context.event.card)
                        }))
                    })
                }))
            ]
        });
    }
}

Gebuk.id = 'gebuk';

module.exports = Gebuk;
