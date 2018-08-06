const DrawCard = require('../../drawcard.js');

class ReaderOfOmens extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.rings.air.isConsideredClaimed(this.controller) ||
                this.game.rings.void.isConsideredClaimed(this.controller)
            ),
            match: this,
            effect: ability.effects.modifyPoliticalSkill(3)
        });
    }
}

ReaderOfOmens.id = 'reader-of-omens';

module.exports = ReaderOfOmens;
