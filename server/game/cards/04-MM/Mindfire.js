const Card = require('../../Card.js');

class Mindfire extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent,
            gameAction: ability.actions.discardAtRandom(),
            then: {
                gameAction: ability.actions.steal((context) => {
                    return {
                        amount:
                            context.preThenEvent.cards.length > 0
                                ? context.preThenEvent.cards[0].bonusIcons.length
                                : 0
                    };
                })
            }
        });
    }
}

Mindfire.id = 'mindfire';

module.exports = Mindfire;
