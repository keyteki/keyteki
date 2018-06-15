const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class WarDogMaster extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain a +X/+0 bonus',
            when: {
                onConflictDeclared: event => event.conflict.attackers.includes(this) && this.controller.dynastyDeck.size() > 0
            },
            handler: () => {
                let card = this.controller.dynastyDeck.first();
                let bonus = card.getCost();
                bonus = _.isNumber(bonus) ? bonus : 0;
                this.game.addMessage('{0} uses {1} to discard {2} and gain a bonus of +{3}/+0', this.controller, this, card, bonus);
                this.controller.moveCard(card, 'dynasty discard pile');
                this.untilEndOfConflict(ability => ({
                    match: this,
                    effect: ability.effects.modifyMilitarySkill(bonus)
                }));
            }
        });
    }
}

WarDogMaster.id = 'war-dog-master';

module.exports = WarDogMaster;
