const DrawCard = require('../../drawcard.js');

class Pragmatism extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.whileAttached({
            condition: () => this.controller.isLessHonorableThanOpponent(),
            effect: [
                ability.effects.modifyMilitarySkill(1),
                ability.effects.modifyPoliticalSkill(1),
                ability.effects.cardCannot('honor'),
                ability.effects.cardCannot('dishonor')
            ]
        });
    }

    canAttach(card, context) {
        if(card.controller !== context.player) {
            return false;
        }
        return super.canAttach(card, context);
    }
}

Pragmatism.id = 'pragmatism'; // This is a guess at what the id might be - please check it!!!

module.exports = Pragmatism;
