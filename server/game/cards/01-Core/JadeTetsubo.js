const DrawCard = require('../../drawcard.js');

class JadeTetsubo extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return all fate from a character',
            cost: ability.costs.bowSelf(),
            condition: context => context.source.parent.isParticipating(),
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.isParticipating() && card.militarySkill < context.source.parent.militarySkill,
                gameAction: ability.actions.removeFate(context => ({
                    amount: context.target.fate,
                    recipient: context.target.owner
                }))
            },
            effect: 'return all fate from {0} to its owner'
        });
    }

    canAttach(card, context) {
        if(card.controller !== context.player) {
            return false;
        }

        return super.canAttach(card, context);
    }
}

JadeTetsubo.id = 'jade-tetsubo';

module.exports = JadeTetsubo;
