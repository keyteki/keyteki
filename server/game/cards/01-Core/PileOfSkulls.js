const Card = require('../../Card.js');

class PileOfSkulls extends Card {
    // Each time an enemy creature is destroyed during your turn,
    // a friendly creature captures 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.clone.controller !== context.player &&
                    context.player === context.game.activePlayer &&
                    event.clone.type === 'creature'
            },
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture()
            }
        });
    }
}

PileOfSkulls.id = 'pile-of-skulls';

module.exports = PileOfSkulls;
