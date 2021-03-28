const Card = require('../../Card.js');

class DestroyThemAll extends Card {
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            targets: {
                artifact: {
                    cardType: ['artifact'],
                    controller: 'any',
                    gameAction: ability.actions.destroy()
                },
                creature: {
                    cardType: ['creature'],
                    controller: 'any',
                    gameAction: ability.actions.destroy()
                },
                upgrade: {
                    cardType: ['upgrade'],
                    controller: 'any',
                    gameAction: ability.actions.destroy()
                }
            },
            effect: 'destroy {1}',
            effectArgs: (context) => [Object.values(context.targets)]
        });
    }
}

DestroyThemAll.id = 'destroy-them-all';

module.exports = DestroyThemAll;
