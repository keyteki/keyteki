import Card from '../../Card.js';

class MontyBankEvilTwin extends Card {
    // Elusive.
    // Play: Exalt Monty Bank 2 times.
    // Action: Steal 1A for each A on Monty Bank.
    setupCardAbilities(ability) {
        this.play({
            effect: 'exalt {0} twice',
            gameAction: [ability.actions.exalt(), ability.actions.exalt()]
        });

        this.action({
            gameAction: ability.actions.steal((context) => ({
                amount: context.source.amber
            }))
        });
    }
}

MontyBankEvilTwin.id = 'monty-bank-evil-twin';

export default MontyBankEvilTwin;
