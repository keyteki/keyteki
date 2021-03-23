const Card = require('../../Card.js');

class MontyBankEvilTwin extends Card {
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

module.exports = MontyBankEvilTwin;
