const Card = require('../../Card.js');

class HauntingDeck extends Card {
    // Play: If you are haunted, purge a card from a discard pile.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.isHaunted(),
            target: {
                controller: 'any',
                location: 'discard',
                gameAction: ability.actions.purge()
            }
        });
    }
}

HauntingDeck.id = 'haunting-deck';

module.exports = HauntingDeck;
