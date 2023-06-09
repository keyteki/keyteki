const Card = require('../../Card.js');

class Barehanded extends Card {
    // Play: Put each artifact on top of its owners deck.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.returnToDeck((context) => ({
                target: context.game.cardsInPlay.filter((card) => card.type === 'artifact')
            }))
        });
    }
}

Barehanded.id = 'barehanded';

module.exports = Barehanded;
