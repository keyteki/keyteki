const DrawCard = require('../../drawcard.js');

class HidaGuardian extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give a character a bonus for each holding',
            condition: () => this.isParticipating(),
            target: {
                source: this,
                cardType: 'character',
                cardCondition: card => card.isParticipating() && card !== this
            },
            handler: context => {
                let bonus = 2 * this.controller.getNumberOfHoldingsInPlay();
                this.game.addMessage('{0} uses {1} to give {2} +{3}/+{3}', this.controller, this, context.target, bonus);
                this.untilEndOfConflict(ability => ({
                    match: context.target,
                    effect: [
                        ability.effects.modifyMilitarySkill(bonus),
                        ability.effects.modifyPoliticalSkill(bonus)
                    ]
                }));
            }
        });
    }
}

HidaGuardian.id = 'hida-guardian';

module.exports = HidaGuardian;
