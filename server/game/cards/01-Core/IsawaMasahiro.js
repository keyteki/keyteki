const DrawCard = require('../../drawcard.js');

class IsawaMasahiro extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow to discard an enemy character' ,
            condition: () => this.game.currentConflict && this.game.currentConflict.hasElement('fire'),
            cost: ability.costs.bowSelf(),
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                gameAction: 'discardCardFromPlay',
                cardCondition: card => card.location === 'play area' && card.getCost() <= 2 && this.game.currentConflict.isParticipating(card)
            },
            handler: context => {
                this.game.addMessage('{0} bows {1} to discard {2}', this.controller, this, context.target);
                context.target.owner.discardCardFromPlay(context.target);
            }
        });
    }
}

IsawaMasahiro.id = 'isawa-masahiro';

module.exports = IsawaMasahiro;
