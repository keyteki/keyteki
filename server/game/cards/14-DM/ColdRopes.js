const Card = require('../../Card.js');

class ColdRopes extends Card {
    // Play: If you are overwhelmed, put an enemy creature on the bottom of its owner's deck. Otherwise, move an enemy creature to a flank of its controller's battleline and exhaust it.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.conditional((context) => ({
                    condition: context.player.isOverwhelmed(),
                    trueGameAction: ability.actions.returnToDeck({
                        bottom: true,
                        target: context.target
                    }),
                    falseGameAction: ability.actions.sequential([
                        ability.actions.moveToFlank({ target: context.target }),
                        ability.actions.exhaust({ target: context.target })
                    ])
                }))
            }
        });
    }
}

ColdRopes.id = 'cold-ropes';

module.exports = ColdRopes;
