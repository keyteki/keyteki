const DrawCard = require('../../drawcard.js');

class SinisterSoshi extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give a character -2/-2',
            condition: () => this.game.currentConflict,
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating()
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to give {2} -2/-2', this.controller, this, context.target);
                this.untilEndOfConflict(ability => ({
                    match: context.target,
                    effect: [
                        ability.effects.modifyMilitarySkill(-2),
                        ability.effects.modifyPoliticalSkill(-2)
                    ]
                }));
            }
        });
    }
}

SinisterSoshi.id = 'sinister-soshi';

module.exports = SinisterSoshi;
