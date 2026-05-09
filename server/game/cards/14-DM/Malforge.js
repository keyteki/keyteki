const Card = require('../../Card.js');

class Malforge extends Card {
    // Treachery. Versatile.
    // You cannot forge keys.
    // At the end of your turn, deal 2 damage to Malforge.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.playerCannot('forge')
        });

        this.interrupt({
            when: {
                onTurnEnd: (event, context) => event.player === context.source.controller
            },
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 2,
                target: context.source
            }))
        });
    }
}

Malforge.id = 'malforge';

module.exports = Malforge;
