const Card = require('../../Card.js');

class DivineSeal extends Card {
    // Play: Put a creature on the bottom of its owner's deck.
    // Fate: Purge the bottom card of your deck.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.returnToDeck({ bottom: true })
            }
        });

        this.fate({
            condition: (context) => context.game.activePlayer.deck.length > 0,
            gameAction: ability.actions.purge((context) => ({
                target: context.game.activePlayer.deck[context.game.activePlayer.deck.length - 1]
            }))
        });
    }
}

DivineSeal.id = 'divine-seal';

module.exports = DivineSeal;
