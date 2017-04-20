const DrawCard = require('../../../drawcard.js');

class Ygritte extends DrawCard {
    setupCardAbilities(ability) {
        // TODO: Cannot be knelt by card effects.
        this.persistentEffect({
            condition: () => this.controlsAnotherWildling(),
            match: this,
            effect: ability.effects.addKeyword('stealth')
        });
    }

    controlsAnotherWildling() {
        return this.controller.anyCardsInPlay(card => card !== this && card.getType() === 'character' && card.hasTrait('Wildling'));
    }
}

Ygritte.code = '06017';

module.exports = Ygritte;
