const Card = require('../../Card.js');

class Cowfyne extends Card {
    // Before Fight: Deal 2D to each neighbor of the creature Cowfyne fights.
    setupCardAbilities(ability) {
        this.beforeFight({
            effect: 'deal 2 damage to each neighbor of the creature being fought',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 2,
                target: context.event.card.neighbors
            }))
        });
    }
}

Cowfyne.id = 'cowfyne';

module.exports = Cowfyne;
