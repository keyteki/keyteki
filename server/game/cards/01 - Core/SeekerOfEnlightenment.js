const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class SeekerOfEnlightenment extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: [
                ability.effects.dynamicMilitarySkill(() => this.getFateOnRings()),
                ability.effects.dynamicPoliticalSkill(() => this.getFateOnRings())
            ]
        });
    }
    
    getFateOnRings() {
        return _.reduce(this.game.rings, (fate, ring) => {
            if(!ring.claimed && !ring.contested) {
                return fate + ring.fate;
            }
            return fate;
        }, 0); 
    }
}

SeekerOfEnlightenment.id = 'seeker-of-enlightenment';

module.exports = SeekerOfEnlightenment;
