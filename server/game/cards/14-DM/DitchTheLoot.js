const Card = require('../../Card.js');

class DitchTheLoot extends Card {
    // Enhance capture capture capture.
    // Play: Move all amber from one creature to another creature.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.game.creaturesInPlay.length >= 2,
            target: {
                cardType: 'creature',
                gameAction: ability.actions.removeAmber({ all: true })
            },
            then: (preThenContext) => ({
                gameAction: ability.actions.placeAmber((context) => ({
                    amount: context.preThenEvent.amount,
                    promptForSelect: {
                        message: '{0} uses {1} to move {4} amber from {2} to {3}',
                        messageArgs: (card) => [
                            context.player,
                            context.source,
                            preThenContext.target,
                            card,
                            context.preThenEvent.amount
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

DitchTheLoot.id = 'ditch-the-loot';

module.exports = DitchTheLoot;
