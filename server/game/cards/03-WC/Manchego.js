const Card = require('../../Card.js');

class Manchego extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => context.player.deck.length <= 5,
            gameAction: ability.actions.steal({ amount: 2 })
        });
        this.fight({
            reap: true,
            may: 'shuffle Manchego back into your deck',
            target: {
                optional: true,
                cardType: ['creature'],
                cardCondition: card => card === this,
                controller: 'self',
                gameAction: ability.actions.returnToDeck({ shuffle: true })
            }
        });
    }
}

Manchego.id = 'manchego';

module.exports = Manchego;
