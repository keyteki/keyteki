const DrawCard = require('../../drawcard.js');

class WayOfTheLion extends DrawCard {
    setupCardAbilities() {
        this.action({
            condition: () => this.game.currentConflict,
            target: {
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && card.isFaction('lion')
            },
            handler: context => {
                let baseSkill = context.target.baseMilitarySkill;
                this.game.addMessage('{0} uses {1} to double {2}\'s base military skill to {3}', this.controller, this, context.target, baseSkill * 2);
                this.untilEndOfConflict(ability => ({
                    match: context.target,
                    effect: ability.effects.modifyBaseMilitarySkill(baseSkill)
                }));
            }
        });
    }
}

WayOfTheLion.id = 'way-of-the-lion';

module.exports = WayOfTheLion;
