const Card = require('../../Card.js');

class ShardOfHate extends Card {
    // Action: Stun an enemy creature for each friendly Shard.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.sequentialForEach((context) => ({
                num:
                    1 +
                    context.player.cardsInPlay.filter(
                        (card) => card !== context.source && card.hasTrait('shard')
                    ).length,
                action: ability.actions.stun({
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature to stun',
                        cardType: 'creature',
                        controller: 'opponent'
                    }
                })
            }))
        });
    }
}

ShardOfHate.id = 'shard-of-hate';

module.exports = ShardOfHate;
