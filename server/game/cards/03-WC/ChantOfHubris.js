const Card = require('../../Card.js');

class ChantOfHubris extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => context.game.creaturesInPlay.length > 1 && context.game.creaturesInPlay.some(card => card.hasToken('amber')),
            target: {
                cardType: 'creature',
                cardCondition: card => card.hasToken('amber'),
                gameAction: ability.actions.removeAmber()
            },
            then: preContext => ({
                gameAction: ability.actions.placeAmber({
                    promptForSelect: {
                        message: '{0} uses {1} to place 1 amber on {2}',
                        messageArgs: card => [preContext.player, preContext.source, card],
                        cardType: 'creature',
                        activePromptTitle: 'Choose another creature',
                        cardCondition: card => card !== preContext.target
                    }
                })
            })
        });
    }
}

ChantOfHubris.id = 'chant-of-hubris';

module.exports = ChantOfHubris;
