const DrawCard = require('../../../drawcard.js');

class SamwellTarly extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isParticipating(this),
            match: card => card !== this && this.game.currentChallenge.isParticipating(card) && !card.hasTrait('Steward') && card.getType() === 'character',
            targetController: 'any',
            effect: ability.effects.blank
        });
    }
}

SamwellTarly.code = '07012';

module.exports = SamwellTarly;
