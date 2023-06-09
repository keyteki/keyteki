const Card = require('../../Card.js');

class SpanglerBox extends Card {
    // Action: Purge a creature in play. If you do, your opponent gains control of Spangler Box. If Spangler Box leaves play, return to play all cards purged by Spangler Box.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.lastingEffect({
                targetController: 'current',
                multipleTrigger: false,
                when: {
                    onCardLeavesPlay: (event, context) => event.card === context.source
                },
                gameAction: ability.actions.sequentialPutIntoPlay((context) => ({
                    forEach: context.event.clone.clonedPurgedCards
                })),
                message: '{0} put into play all creatures purged by {1}',
                messageArgs: (context) => [context.game.activePlayer, context.source]
            })
        });

        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.purge((context) => ({
                    purgedBy: context.source
                }))
            },
            effect: 'purge a creature and give control to the other player',
            then: {
                condition: (context) => !!context.player.opponent,
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.player.opponent)
                }))
            }
        });
    }
}

SpanglerBox.id = 'spangler-box';

module.exports = SpanglerBox;
