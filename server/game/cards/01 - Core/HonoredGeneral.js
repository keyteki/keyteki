const DrawCard = require('../../drawcard.js');

class HonoredGeneral extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentConflict && this.game.currentConflict.isParticipating(this),
            match: card => card.getType() === 'character' && this.game.currentConflict.isParticipating(card) && card.isFaction('lion') && card !== this,
            effect: ability.effects.modifyMilitarySkill(1)
        });
        this.reaction({
            when: {
                onCardEntersPlay: (event, params) => {
                    console.log('onCardEntersPlay', params.card.name);
                    return params.card === this;
                }
            },
            handler: () => this.controller.honorCard(this)
        });
    }
}

HonoredGeneral.id = 'honored-general';

module.exports = HonoredGeneral;


