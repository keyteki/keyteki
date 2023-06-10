const Card = require('../../Card.js');

class NotFinishedWithYou extends Card {
    // Play: Shuffle any number of creatures from your discard pile into your deck.
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose which creatures to return',
                mode: 'unlimited',
                controller: 'self',
                cardType: 'creature',
                location: 'discard',
                gameAction: [ability.actions.returnToDeck({ shuffle: true })]
            }
        });
    }
}

NotFinishedWithYou.id = 'not-finished-with-you';

module.exports = NotFinishedWithYou;
