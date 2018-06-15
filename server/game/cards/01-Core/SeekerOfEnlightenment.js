const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class SeekerOfEnlightenment extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyBothSkills(() => this.getFateOnRings())
        });
    }

    getFateOnRings() {
        return _.reduce(this.game.rings, (fate, ring) => {
            if(ring.isUnclaimed()) {
                return fate + ring.fate;
            }
            return fate;
        }, 0);
    }
}

SeekerOfEnlightenment.id = 'seeker-of-enlightenment';

module.exports = SeekerOfEnlightenment;
