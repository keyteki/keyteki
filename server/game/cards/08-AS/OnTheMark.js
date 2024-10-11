const Card = require('../../Card.js');

class OnTheMark extends Card {
    // Play: Choose a friendly creature. Move each A on that creature
    // to an enemy creature.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent &&
                context.player.creaturesInPlay.length > 0 &&
                context.player.opponent.creaturesInPlay.length > 0,
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.removeAmber({ all: true })
            },
            then: {
                gameAction: ability.actions.placeAmber((context) => ({
                    promptForSelect: {
                        cardType: 'creature',
                        controller: 'opponent',
                        message: '{0} uses {1} to place {2} amber on {3}',
                        messageArgs: (card) => [
                            context.player,
                            context.source.name,
                            context.preThenEvents[0].clone.amber,
                            card
                        ]
                    },
                    amount: context.preThenEvents[0].clone.amber
                }))
            }
        });
    }
}

OnTheMark.id = 'on-the-mark';

module.exports = OnTheMark;
