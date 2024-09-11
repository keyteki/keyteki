const Card = require('../../Card.js');

class SummonedCounsel extends Card {
    // After Reap: Choose a card in your discard pile or a purged card
    // you own. Shuffle the chosen card into your deck.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                controller: 'self',
                location: ['discard', 'purged'],
                gameAction: ability.actions.returnToDeck({ shuffle: true })
            }
        });
    }
}

SummonedCounsel.id = 'summoned-counsel';

module.exports = SummonedCounsel;
