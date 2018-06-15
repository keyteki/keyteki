const DrawCard = require('../../drawcard.js');

class PoliticalRival extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentConflict && this.game.currentConflict.isDefending(this),
            match: this,
            effect: ability.effects.modifyPoliticalSkill(3)
        });
    }
}

PoliticalRival.id = 'political-rival';

module.exports = PoliticalRival;
