const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class SeekerOfKnowledge extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking() && _.any(this.game.rings, ring => ring.contested),
            match: this,
            effect: ability.effects.addConflictElement('air')
        });
    }
}

SeekerOfKnowledge.id = 'seeker-of-knowledge';

module.exports = SeekerOfKnowledge;
