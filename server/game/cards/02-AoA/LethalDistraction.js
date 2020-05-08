const Card = require('../../Card.js');

class LethalDistraction extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.forRemainderOfTurn(context => ({
                    when: {
                        onDamageDealt: event => event.damageSource !== context.source && event.card === context.target
                    },
                    gameAction: ability.actions.dealDamage({ damageSource: context.source, amount: 2, target: context.target })
                }))
            },
            effect: 'make {0} take 2 extra damage whenever they take damage'
        });
    }
}

LethalDistraction.id = 'lethal-distraction';

module.exports = LethalDistraction;
