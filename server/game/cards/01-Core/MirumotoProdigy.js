const DrawCard = require('../../drawcard.js');

class MirumotoProdigy extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: this.isAttacking() && this.game.currentConflict.attackers.length === 1,
            match: this,
            effect: ability.effects.restrictNumberOfDefenders(1)
        });
    }
}

MirumotoProdigy.id = 'mirumoto-prodigy';

module.exports = MirumotoProdigy;
