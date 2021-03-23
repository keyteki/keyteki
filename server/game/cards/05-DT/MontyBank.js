const Card = require('../../Card.js');

class MontyBank extends Card {
    setupCardAbilities(ability) {
        this.play({
            optional: true,
            gameAction: ability.actions.exalt(),
            then: {
                optional: true,
                gameAction: ability.actions.exalt()
            }
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
