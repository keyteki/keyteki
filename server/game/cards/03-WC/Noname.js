const Card = require('../../Card.js');

class Noname extends Card {
    // Noname gets +1 power for each purged card.
    // Play/Fight/Reap: Purge a card in a discard pile.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower(
                () => this.game.allCards.filter((card) => card.location === 'purged').length
            )
        });
        this.play({
            fight: true,
            reap: true,
            target: {
                mode: 'exactly',
                numCards: 1,
                location: 'discard',
                gameAction: ability.actions.purge()
            }
        });
    }
}

Noname.id = 'noname';

module.exports = Noname;
