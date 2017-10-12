const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class Outwit extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Choose a character – send it home.',
            condition: () => this.game.currentConflict && this.controller.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('courtier')),
            target: {
                activePromptTitle: 'Select a character',
                cardType: 'character',
                cardCondition: card => card.isParticipating() && card.controller !== this.controller && card.getMilitarySkill() < _.max(this.controller.filterCardsInPlay(card => card.isParticipating() && card.hasTrait('courtier')), card => card.getMilitarySkill())
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to send {2} home', this.controller, this, context.target);
                this.game.currentConflict.sendHome(context.target);
            }
        });
    }
}

Outwit.id = 'outwit';

module.exports = Outwit;
