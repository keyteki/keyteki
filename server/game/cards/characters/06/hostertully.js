const DrawCard = require('../../../drawcard.js');

class HosterTully extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isParticipating(this),
            match: card => card !== this && this.game.currentChallenge.isParticipating(card) && card.hasTrait('House Tully'),
            effect: ability.effects.addKeyword('Renown')
        });
    }
}

HosterTully.code = '06001';

module.exports = HosterTully;
