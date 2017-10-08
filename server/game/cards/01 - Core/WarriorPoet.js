const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class WarriorPoet extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Reduced skill of characters',
            target: {
                cardType: 'character',
                cardCondition: card => this.game.currentConflict && card.location === 'play area' && card.controller === this.game.getOtherPlayer(this.controller)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to reduce the skill of all {2}\'s characters', this.controller, this, this.game.getOtherPlayer(this.controller));
                _.each(context.target, card => {
                    card.untilEndOfConflict(ability => ({
                        match: card,
                        effect: [
                            ability.effects.modifyPoliticalSkill(-1),
                            ability.effects.modifyMilitarySkill(-1)
                        ]    
                    }));
                });
            }
        });
    }
}

WarriorPoet.id = 'warrior-poet';

module.exports = WarriorPoet;
