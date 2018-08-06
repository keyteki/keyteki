const DrawCard = require('../../drawcard.js');

class ChikaiOrderProtector extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.persistentEffect({
            match: this,
            condition: () => this.isDefending() && this.controller.cardsInPlay.any(card => card.getType() === 'character' && card.isParticipating() && (card.hasTrait('courtier') || card.hasTrait('shugenja'))),
            effect: ability.effects.doesNotBow()
        });
    }
}

ChikaiOrderProtector.id = 'chikai-order-protector';

module.exports = ChikaiOrderProtector;
