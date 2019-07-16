const Card = require('../../Card.js');

class PileOfSkulls extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.clone.controller !== context.player &&
                    context.player === this.game.activePlayer &&
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
