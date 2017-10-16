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
                onCardEntersPlay: event => event.card === this
            },
            handler: () => {
                this.controller.honorCard(this);
                this.game.addMessage('{0} uses {1} to honor himself', this.controller, this);
            }
        });
    }
}

HonoredGeneral.id = 'honored-general';

module.exports = HonoredGeneral;


