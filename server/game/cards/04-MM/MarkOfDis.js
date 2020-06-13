const Card = require('../../Card.js');

class MarkOfDis extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.sequential([
                    ability.actions.dealDamage({ amount: 2 }),
                    ability.actions.conditional((context) => ({
                        condition: () => context.target.location === 'play area',
                        trueGameAction: ability.actions.lastingEffect(() => ({
                            duration: 'untilNextTurn',
                            roundDuration: 3,
                            targetController: context.target.controller,
                            effect: ability.effects.restrictHouseChoice(context.target.getHouses())
                        }))
                    }))
                ])
            },
            effect: 'deal 2 damage to {0}'
        });
    }
}

MarkOfDis.id = 'mark-of-dis';

module.exports = MarkOfDis;
