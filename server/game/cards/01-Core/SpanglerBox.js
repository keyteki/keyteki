const Card = require('../../Card.js');

class SpanglerBox extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.purge()
            },
            effect: 'purge a creature and give control to the other player',
            then: {
                gameAction: ability.actions.placeUnder((context) => ({
                    moveGigantic: true,
                    parent: context.source,
                    target: context.preThenEvent.card
                })),
                then: {
                    condition: (context) => !!context.player.opponent,
                    gameAction: ability.actions.cardLastingEffect((context) => ({
                        duration: 'lastingEffect',
                        effect: ability.effects.takeControl(context.player.opponent)
                    }))
                }
            }
        });
        this.leavesPlay({
            effect: 'returning to play all creatures purged by Spangler Box',
            gameAction: ability.actions.sequentialForEach((context) => ({
                forEach: context.source.childCards,
                action: ability.actions.putIntoPlay()
            }))
        });
    }
}

SpanglerBox.id = 'spangler-box';

module.exports = SpanglerBox;
