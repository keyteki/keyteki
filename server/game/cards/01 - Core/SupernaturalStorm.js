const DrawCard = require('../../drawcard.js');

class SupernaturalStorm extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Increase the skill of one character',
            condition: () => this.game.currentConflict,
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && this.game.currentConflict.isParticipating(card)
            },
            handler: context => {
                let shugenja = this.controller.filterCardsInPlay(card => card.hasTrait('shugenja') && card.getType() === 'character');
                let numOfShugenja = shugenja.length;
                this.untilEndOfConflict(ability => ({
                    match: context.target,
                    effect: [
                        ability.effects.modifyMilitarySkill(numOfShugenja),
                        ability.effects.modifyPoliticalSkill(numOfShugenja)
                    ]
                }));
                this.game.addMessage('{0} uses {1} to increase the political and military skill of {2} by {3}', this.controller, this, context.target, numOfShugenja);
            }
        });
    }
}

SupernaturalStorm.id = 'supernatural-storm';

module.exports = SupernaturalStorm;
