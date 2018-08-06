const DrawCard = require('../../drawcard.js');

class AdoptedKin extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.getType() === 'attachment' && this.parent,
            match: card => card !== this && card.getType() === 'attachment' && this.parent === card.parent,
            effect: ability.effects.addKeyword('ancestral'),
            targetController: 'any'
        });
    }

    canAttach(card, context) {
        if(card.attachments && card.attachments.any(card => card.id === 'adopted-kin' && card !== this)) {
            return false;
        }
        return super.canAttach(card, context);
    }
}

AdoptedKin.id = 'adopted-kin';

module.exports = AdoptedKin;
