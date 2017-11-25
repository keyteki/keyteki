const DrawCard = require('../../drawcard.js');

class IsawaAtsuko extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Wield the power of the void',
            condition: () => this.game.currentConflict && this.game.currentConflict.hasElement('void'),
            handler: () => {
                this.game.addMessage('{0} uses {1} to give friendly characters +1/+1 and opposing characters -1/-1', this.controller, this);
                this.controller.cardsInPlay.each(card => {
                    if(card.isParticipating()) {
                        this.untilEndOfConflict(ability => ({
                            match: card,
                            effect: [
                                ability.effects.modifyMilitarySkill(1),
                                ability.effects.modifyPoliticalSkill(1)
                            ]
                        }));
                    }
                });
                if(this.controller.opponent) {
                    this.controller.opponent.cardsInPlay.each(card => {
                        if(card.isParticipating()) {
                            this.untilEndOfConflict(ability => ({
                                match: card,
                                effect: [
                                    ability.effects.modifyMilitarySkill(-1),
                                    ability.effects.modifyPoliticalSkill(-1)
                                ]
                            }));
                        }
                    });
                }
            }
        });
    }
}

IsawaAtsuko.id = 'isawa-atsuko';

module.exports = IsawaAtsuko;
