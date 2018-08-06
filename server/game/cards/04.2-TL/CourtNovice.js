const DrawCard = require('../../drawcard.js');

class CourtNovice extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.rings.air.isConsideredClaimed(this.controller) ||
                this.game.rings.water.isConsideredClaimed(this.controller)
            ),
            match: this,
            effect: ability.effects.modifyPoliticalSkill(2)
        });
    }
}

CourtNovice.id = 'court-novice';

module.exports = CourtNovice;
