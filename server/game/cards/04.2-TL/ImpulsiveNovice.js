const DrawCard = require('../../drawcard.js');

class ImpulsiveNovice extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.rings.fire.isConsideredClaimed(this.controller) ||
                this.game.rings.void.isConsideredClaimed(this.controller)),
            match: this,
            effect: ability.effects.modifyBothSkills(1)
        });
    }
}

ImpulsiveNovice.id = 'impulsive-novice';

module.exports = ImpulsiveNovice;
