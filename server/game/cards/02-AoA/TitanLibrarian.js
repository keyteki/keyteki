const Card = require('../../Card.js');

class TitanLibrarian extends Card {
    // At the end of your turn, if Titan Librarian is not on a flank, archive a card.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (event, context) =>
                    context.player === this.game.activePlayer && !this.isOnFlank()
            },
            target: {
                location: 'hand',
                controller: 'self',
                gameAction: ability.actions.archive()
            }
        });
    }
}

TitanLibrarian.id = 'titan-librarian';

module.exports = TitanLibrarian;
