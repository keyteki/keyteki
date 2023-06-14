const Card = require('../../Card.js');

class RockhurlingGiant extends Card {
    // During your turn, each time you
    // discard a Brobnar card from your hand, you may deal 4D to a creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.location === 'hand' &&
                    event.card.controller === context.player &&
                    context.game.activePlayer === context.player &&
                    event.card.hasHouse('brobnar')
            },
            optional: true,
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 4 })
            }
        });
    }
}

RockhurlingGiant.id = 'rock-hurling-giant';

module.exports = RockhurlingGiant;
