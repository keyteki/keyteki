const Card = require('../../Card.js');

class SpanglerBox extends Card {
    setupCardAbilities(ability) {
        this.purgedCreatures = [];
        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.purge({
                    postHandler: context => this.game.actions.placeUnder({ parent: context.source}).resolve(context.target, context)
                })
            },
            effect: 'purge a creature and give control to the other player',
            then: {
                condition: context => !!context.player.opponent,
                gameAction: ability.actions.cardLastingEffect(context => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.player.opponent)
                }))
            }
        });
        this.leavesPlay({
            effect: 'returning to play all creatures purged by Spangler Box',
            gameAction: ability.actions.sequentialForEach(context => ({
                forEach: context.source.childCards,
                action: ability.actions.putIntoPlay()
            }))
        });
    }
}

SpanglerBox.id = 'spangler-box';

module.exports = SpanglerBox;
