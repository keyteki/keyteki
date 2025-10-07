import Card from '../../Card.js';

class TrainingCosts extends Card {
    // Training Costs cannot be discarded from your hand except
    // through card abilities.
    //
    // Play: Lose 2Aember. If you do not, shuffle Training Costs into
    // your deck.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: [ability.effects.cardCannot('discardExceptCardAbilities')]
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
                condition: (context) => context.preThenEvent.amount < 2,
                gameAction: ability.actions.returnToDeck({ shuffle: true }),
                message: '{0} uses {1} to shuffle it back into their deck'
            }
        });
    }
}

TrainingCosts.id = 'training-costs';

export default TrainingCosts;
