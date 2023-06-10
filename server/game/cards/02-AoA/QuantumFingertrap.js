const Card = require('../../Card.js');

class QuantumFingertrap extends Card {
    // Action: Swap the positions of two creatures in a battleline.
    setupCardAbilities(ability) {
        this.action({
            targets: {
                first: {
                    cardType: 'creature',
                    controller: 'any',
                    cardCondition: (card) =>
                        card.controller.creaturesInPlay.length > 1 ||
                        (card.controller.opponent &&
                            card.controller.opponent.creaturesInPlay.length > 1)
                },
                second: {
                    dependsOn: 'first',
                    cardType: 'creature',
                    cardCondition: (card, context) =>
                        context.targets.first &&
                        card !== context.targets.first &&
                        card.controller === context.targets.first.controller,
                    gameAction: ability.actions.swap((context) => ({
                        origin: context.targets.first
                    }))
                }
            }
        });
    }
}

QuantumFingertrap.id = 'quantum-fingertrap';

module.exports = QuantumFingertrap;
