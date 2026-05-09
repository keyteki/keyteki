const Card = require('../../Card.js');

class WraithConstruct extends Card {
    // At the start of your turn, discard a card from your hand.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onTurnStart: (_, context) => context.player === this.game.activePlayer
            },
            target: {
                location: 'hand',
                controller: 'self',
                gameAction: ability.actions.discard()
            }
        });
    }
}

WraithConstruct.id = 'wraith-construct';

module.exports = WraithConstruct;
