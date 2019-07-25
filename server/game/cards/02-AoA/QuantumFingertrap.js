const Card = require('../../Card.js');

class QuantumFingertrap extends Card {
    setupCardAbilities(ability) {
        this.action({
            targets: {
                first: {
                    cardType: 'creature',
                    controller: 'any'
                },
                second: {
                    dependsOn: 'first',
                    cardType: 'creature',
                    cardCondition: (card, context) => card !== context.targets.first && card.controller === context.targets.first.controller,
                    gameAction: ability.actions.swap(context => ({ origin: context.targets.first, originIndex: context.targets.first.controller.cardsInPlay.indexOf(context.targets.first)}))
                }
            }
        });
    }
}

QuantumFingertrap.id = 'quantum-fingertrap';

module.exports = QuantumFingertrap;
