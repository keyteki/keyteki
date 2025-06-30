const Card = require('../../Card.js');

class DecreeOfPrimus extends Card {
    // Play: Choose a creature. Move all amber from that creature to another creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.removeAmber({ all: true })
            },
            then: (preThenContext) => ({
                gameAction: ability.actions.placeAmber((context) => ({
                    amount: context.preThenEvent.amount,
                    promptForSelect: {
                        message: '{0} uses {1} to move all amber from {2} to {3}',
                        messageArgs: (card) => [
                            context.player,
                            context.source,
                            preThenContext.target,
                            card
                        ],
                        cardType: 'creature',
                        activePromptTitle: 'Choose another creature',
                        cardCondition: (card) => card !== preThenContext.target
                    }
                }))
            })
        });
    }
}

DecreeOfPrimus.id = 'decree-of-primus';

module.exports = DecreeOfPrimus;
