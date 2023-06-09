const Card = require('../../Card.js');

class TrainingCosts extends Card {
    // You cannot choose to discard Training Costs from your hand.
    //
    // Play: Lose 2Aember. If you do not, shuffle Training Costs into
    // your deck.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: [ability.effects.cardCannot('discard')]
        });

        this.play({
            gameAction: ability.actions.loseAmber((context) => {
                return {
                    target: context.player,
                    amount: 2
                };
            }),
            then: {
                alwaysTriggers: true,
                condition: (context) => context.preThenEvent.amount > -2,
                gameAction: ability.actions.returnToDeck({ shuffle: true }),
                message: '{0} uses {1} to shuffle it back into their deck'
            }
        });
    }
}

TrainingCosts.id = 'training-costs';

module.exports = TrainingCosts;
