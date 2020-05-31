const Card = require('../../Card.js');

class ShardOfHate extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.sequentialForEach((context) => ({
                num: context.player.cardsInPlay.filter((card) => card.hasTrait('shard')).length,
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
