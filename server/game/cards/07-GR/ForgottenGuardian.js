const Card = require('../../Card.js');

class ForgottenGuardian extends Card {
    // Play: Purge a card from a discard pile.
    //
    // Scrap: Shuffle a purged card into its owner’s deck.
    setupCardAbilities(ability) {
        this.play({
            target: {
                location: 'discard',
                mode: 'exactly',
                numCards: 1,
                controller: 'any',
                gameAction: ability.actions.purge()
            }
        });

        this.scrap({
            target: {
                location: 'purged',
                controller: 'any',
                mode: 'exactly',
                numCards: 1,
                gameAction: ability.actions.returnToDeck({ shuffle: true })
            }
        });
    }
}

ForgottenGuardian.id = 'forgotten-guardian';

module.exports = ForgottenGuardian;
