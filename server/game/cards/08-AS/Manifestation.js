const Card = require('../../Card.js');

class Manifestation extends Card {
    // Play: Choose a card in a haunted player’s discard pile. Resolve
    // its bonus icons as if you had played it.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'any',
                location: 'discard',
                cardCondition: (card) => card.controller.isHaunted(),
                gameAction: ability.actions.resolveBonusIcons()
            }
        });
    }
}

Manifestation.id = 'manifestation';

module.exports = Manifestation;
