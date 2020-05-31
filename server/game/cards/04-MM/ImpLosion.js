const Card = require('../../Card.js');

class ImpLosion extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                friendly: {
                    mode: 'exactly',
                    numCards: 1,
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.destroy()
                },
                enemy: {
                    mode: 'exactly',
                    numCards: 1,
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.destroy()
                }
            },
            effects: 'destroy {1}',
            effectsArg: (context) => [Object.values(context.targets)]
        });
    }
}

ImpLosion.id = 'imp-losion';

module.exports = ImpLosion;
