const Card = require('../../Card.js');

class SpanglerBox extends Card {
    setupCardAbilities(ability) {
        this.purgedCreatures = [];
        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.purge({
                    postHandler: context => this.purgedCreatures.push(context.target)
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
            gameAction: ability.actions.putIntoPlay({
                target: this.purgedCreatures,
                postHandler: () => this.purgedCreatures = []
            })
        });
    }
}

SpanglerBox.id = 'spangler-box'; // This is a guess at what the id might be - please check it!!!

module.exports = SpanglerBox;
