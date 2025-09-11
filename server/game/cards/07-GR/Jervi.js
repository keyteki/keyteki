const Card = require('../../Card.js');

class Jervi extends Card {
    // After Reap: Search your deck for a card and put it into your hand.
    //
    // Scrap: Archive a card from your discard pile.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.search({
                location: ['deck'],
                amount: 1,
                reveal: false
            })
        });

        this.scrap({
            target: {
                location: 'discard',
                controller: 'self',
                mode: 'exactly',
                numCards: 1,
                gameAction: ability.actions.archive()
            }
        });
    }
}

Jervi.id = 'jervi';

module.exports = Jervi;
