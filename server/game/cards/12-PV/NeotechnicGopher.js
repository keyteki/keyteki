const Card = require('../../Card.js');

class NeotechnicGopher extends Card {
    // Play/After Reap: Discard a card. If you have no cards in your hand, gain 1 amber.
    // Fate: Your opponent draws a card.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            target: {
                activePromptTitle: 'Choose a card to discard',
                location: 'hand',
                controller: 'self',
                gameAction: ability.actions.discard()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) => context.player.hand.length === 0,
                gameAction: ability.actions.gainAmber(),
                message: '{0} uses {1} to gain 1 amber'
            }
        });

        this.fate({
            effect: 'make their opponent draw a card',
            gameAction: ability.actions.draw((context) => ({
                target: context.game.activePlayer.opponent
            }))
        });
    }
}

NeotechnicGopher.id = 'neotechnic-gopher';

module.exports = NeotechnicGopher;
