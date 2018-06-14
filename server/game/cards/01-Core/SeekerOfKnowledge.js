const DrawCard = require('../../drawcard.js');

class SeekerOfKnowledge extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            match: ring => ring.contested,
            effect: ability.effects.addElement('air')
        });
    }
}

SeekerOfKnowledge.id = 'seeker-of-knowledge';

module.exports = SeekerOfKnowledge;
