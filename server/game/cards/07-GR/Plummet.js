const Card = require('../../Card.js');

class Plummet extends Card {
    // Play: Discard your hand. Deal 1 to each creature for each card
    // discarded this way.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discardEntireLocation((context) => ({
                location: 'hand',
                target: context.player
            })),
            then: {
                gameAction: ability.actions.dealDamage((context) => ({
                    target: context.game.creaturesInPlay,
                    amount: context.preThenCards.length
                })),
                message: '{0} uses {1} to deal {3} damage to each creature',
                messageArgs: (context) => [context.preThenCards.length]
            }
        });
    }
}

Plummet.id = 'plummet';

module.exports = Plummet;
