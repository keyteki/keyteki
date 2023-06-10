const Card = require('../../Card.js');

class MarkOfDis extends Card {
    // Play: Deal 2D to a creature. If it is not destroyed, its controller must choose that creatures house as their active house on their next turn.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.sequential([
                    ability.actions.dealDamage({ amount: 2 }),
                    ability.actions.conditional((context) => ({
                        condition: () => context.target.location === 'play area',
                        trueGameAction: ability.actions.untilEndOfMyNextTurn({
                            targetController:
                                context.player === context.target.controller
                                    ? 'current'
                                    : 'opponent',
                            effect: ability.effects.restrictHouseChoice(context.target.getHouses())
                        })
                    }))
                ])
            },
            effect: 'deal 2 damage to {0}'
        });
    }
}

MarkOfDis.id = 'mark-of-dis';

module.exports = MarkOfDis;
