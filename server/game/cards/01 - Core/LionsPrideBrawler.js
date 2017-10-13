const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class LionsPrideBrawler extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: () => this.game.currentConflict && this.game.currentConflict.isAttacking(this),
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                cardCondition: card => !card.bowed && card.getMilitarySkill() <= this.getMilitarySkill()
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to bow {2}', this.controller, this), context.target.getGlory();
                this.controller.bowCard(context.target);
            }
        });
    }
}

LionsPrideBrawler.id = 'lion-s-pride-brawler';

module.exports = LionsPrideBrawler;
