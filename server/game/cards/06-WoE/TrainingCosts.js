const Card = require('../../Card.js');

class TrainingCosts extends Card {
    // You cannot choose to discard Training Costs from your hand.
    //
    // Play: Lose 2Aember. If you do not, shuffle Training Costs into
    // your deck.
    setupCardAbilities(ability) {
        this.startingAmber = 0;

        this.persistentEffect({
            location: 'any',
            effect: [ability.effects.cardCannot('discard')]
        });

        this.play({
            gameAction: ability.actions.loseAmber((context) => {
                this.startingAmber = context.player.amber;
                return {
                    target: context.player,
                    amount: 2
                };
            }),
            then: {
                alwaysTriggers: true,
                condition: () => this.startingAmber < 2,
                gameAction: ability.actions.returnToDeck({ shuffle: true }),
                message: '{0} uses {1} to shuffle it back into their deck'
            }
        });
    }
}

TrainingCosts.id = 'training-costs';

module.exports = TrainingCosts;
