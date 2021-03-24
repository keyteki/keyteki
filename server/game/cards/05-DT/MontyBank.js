const Card = require('../../Card.js');

class MontyBank extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                optional: true,
                mode: 'select',
                choices: {
                    'Exalt once': ability.actions.exalt(),
                    'Exalt twice': [ability.actions.exalt(), ability.actions.exalt()]
                }
            },
            effect: 'exalt {0}{1}',
            effectArgs: (context) =>
                context.target && context.target.choice === 'Exalt once' ? ' once' : ' twice'
        });

        this.action({
            gameAction: ability.actions.steal((context) => ({
                amount: context.source.amber
            }))
        });
    }
}

MontyBank.id = 'monty-bank';

module.exports = MontyBank;
