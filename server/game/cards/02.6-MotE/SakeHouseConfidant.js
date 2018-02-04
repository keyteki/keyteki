const DrawCard = require('../../drawcard.js');

class SakeHouseConfidant extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give Shinobi +2 political',
            condition: () => this.isParticipating(),
            cost: ability.costs.discardImperialFavor(),
            handler: () => {
                this.game.addMessage('{0} uses {1} to discard the imperial favor and give all controlled Shinobi +2 political', this.controller, this);
                this.controller.cardsInPlay.each(card => {
                    if(card.hasTrait('shinobi')) {
                        this.untilEndOfConflict(ability => ({
                            match: card,
                            effect: ability.effects.modifyPoliticalSkill(2)
                        }));
                    }
                });
            }
        });
    }
}

SakeHouseConfidant.id = 'sake-house-confidant';

module.exports = SakeHouseConfidant;
