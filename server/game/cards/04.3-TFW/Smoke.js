const DrawCard = require('../../drawcard.js');

class Smoke extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give non-unique characters -2/+0',
            condition: context => this.game.isDuringConflict() && context.source.parent && context.source.parent.isParticipating(),
            cost: [ability.costs.bowSelf(), ability.costs.sacrificeSelf()],
            gameAction: ability.actions.cardLastingEffect(context => ({
                target: context.game.currentConflict.getParticipants().filter(card => !card.isUnique()),
                effect: ability.effects.modifyMilitarySkill(-2)
            })),
            effect: 'give all non-unique participating characters -2{1}',
            effectArgs: () => ['military']
        });
    }
}

Smoke.id = 'smoke';

module.exports = Smoke;
