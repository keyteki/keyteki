const Card = require('../../Card.js');

class Salvatorem extends Card {
    // You cannot play Salvatorem.
    // Each friendly ready creature with A on it cannot be dealt damage.
    // Fate: Put Salvatorem into play under your opponent's control.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.cardCannot('play')
        });

        this.persistentEffect({
            targetController: 'current',
            match: (card) => !card.exhausted && card.amber > 0,
            effect: ability.effects.cardCannot('damage')
        });

        this.fate({
            gameAction: ability.actions.putIntoPlay((context) => ({
                controller: context.game.activePlayer.opponent
            }))
        });
    }
}

Salvatorem.id = 'salvatorem';

module.exports = Salvatorem;
