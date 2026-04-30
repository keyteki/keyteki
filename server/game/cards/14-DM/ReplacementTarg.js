const Card = require('../../Card.js');

class ReplacementTarg extends Card {
    // Deploy.
    // Play: Put a neighboring non-Soldier creature into its owner's hand. If you do, the most powerful friendly creature captures 2.
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a creature',
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card, context) =>
                    !card.hasTrait('soldier') && context.source.neighbors.includes(card),
                gameAction: ability.actions.returnToHand()
            },
            then: (preThenContext) => ({
                alwaysTriggers: true,
                condition: () => preThenContext.target.location === 'hand',
                target: {
                    mode: 'mostStat',
                    cardType: 'creature',
                    controller: 'self',
                    numCards: 1,
                    cardStat: (card) => card.power,
                    gameAction: ability.actions.capture({ amount: 2 })
                }
            })
        });
    }
}

ReplacementTarg.id = 'replacement-targ';

module.exports = ReplacementTarg;
