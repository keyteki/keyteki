import Card from '../../Card.js';

class MontyBank extends Card {
    // Play: You may exalt Monty Bank up to 2 times.
    // Action: Steal 1A for each A on Monty Bank.
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
            effectArgs: (context) => (context.select === 'Exalt once' ? ' once' : ' twice')
        });

        this.action({
            gameAction: ability.actions.steal((context) => ({
                amount: context.source.amber
            }))
        });
    }
}

MontyBank.id = 'monty-bank';

export default MontyBank;
