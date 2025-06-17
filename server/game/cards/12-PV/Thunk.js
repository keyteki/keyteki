const Card = require('../../Card.js');

class Thunk extends Card {
    // Play: Deal 2 to an enemy creature and exhaust it.
    // Fate: Destroy each exhausted creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: [ability.actions.dealDamage({ amount: 2 }), ability.actions.exhaust()]
            },
            effect: 'deal 2 damage to {0} and exhaust it'
        });

        this.fate({
            effect: 'destroy each exhausted creature',
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.exhausted)
            }))
        });
    }
}

Thunk.id = 'thunk';

module.exports = Thunk;
