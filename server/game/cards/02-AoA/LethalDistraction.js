const Card = require('../../Card.js');

class LethalDistraction extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.forRemainderOfTurn(context => ({
                    when: {
                        onDamageDealt: event => event.card === context.target
                    },
                    message: '{2} is dealt 2 damage due to {1}\'s effect',
                    gameAction: ability.actions.dealDamage({ amount: 2 })
                }))
            },
            effect: 'make {0} take 2 extra damage whenever they take damage'
        });
    }
}

LethalDistraction.id = 'lethal-distraction';

module.exports = LethalDistraction;
