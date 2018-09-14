const Card = require('../../Card.js');

class PileOfSkulls extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) => event.clone.controller !== context.player && context.player === this.game.activePlayer
            },
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture()
            }
        });
    }
}

PileOfSkulls.id = 'pile-of-skulls'; // This is a guess at what the id might be - please check it!!!

module.exports = PileOfSkulls;
