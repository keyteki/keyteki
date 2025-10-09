const Card = require('../../Card.js');

class ArticulatedRen extends Card {
    // At the end of your turn, you may exhaust a friendly
    // creature. If you do, draw a card.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onTurnEnded: (event, context) => context.player === this.game.activePlayer
            },
            target: {
                optional: true,
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.exhaust()
            },
            then: {
                gameAction: ability.actions.draw()
            }
        });
    }
}

ArticulatedRen.id = 'articulated-ren';

module.exports = ArticulatedRen;
