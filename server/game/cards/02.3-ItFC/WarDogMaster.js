const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class WarDogMaster extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain a +X/+0 bonus',
            when: {
                onConflictDeclared: (event, context) => context.source.isAttacking()
            },
            cost: ability.costs.discardCardSpecific(context => context.player.dynastyDeck.first()),
            effect: 'give {0} a bonus of {1} to their military skill',
            effectArgs: context => _.isNumber(context.costs.discardCard.getCost()) ? context.costs.discardCard.getCost() : 0,
            handler: context => ability.actions.cardLastingEffect({
                effect: ability.effects.modifyMilitarySkill(
                    _.isNumber(context.costs.discardCard.getCost()) ? context.costs.discardCard.getCost() : 0
                )
            }).resolve(context.source, context)
        });
    }
}

WarDogMaster.id = 'war-dog-master';

module.exports = WarDogMaster;
