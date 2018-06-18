const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class WarDogMaster extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain a +X/+0 bonus',
            when: {
                onConflictDeclared: (event, context) => context.source.isAttacking()
            },
            cost: ability.costs.discardSpecific(context => context.player.dynastyDeck.first()),
            effect: 'give {0} a bonus to their military skill',
            gameAction: ability.actions.cardLastingEffect(context => ({
                effect: ability.effects.modifyMilitarySkill(
                    _.isNumber(context.costs.discardSpecific.getCost()) ? context.costs.discardSpecific.getCost() : 0
                )
            }))
        });
    }
}

WarDogMaster.id = 'war-dog-master';

module.exports = WarDogMaster;
