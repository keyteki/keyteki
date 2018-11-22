const Card = require('../../Card.js');

class RockhurlingGiant extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.location === 'hand' && event.card.controller === context.player &&
                    context.game.activePlayer === context.player && event.card.hasHouse('brobnar')
            },
            optional: true,
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 4 })
            }
        });
    }
}

RockhurlingGiant.id = 'rock-hurling-giant'; // This is a guess at what the id might be - please check it!!!

module.exports = RockhurlingGiant;
