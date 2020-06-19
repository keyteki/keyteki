const Card = require('../../Card.js');

class TitanLibrarian extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                atEndOfTurn: (event, context) =>
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
