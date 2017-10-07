const DrawCard = require('../../drawcard.js');

class Assassination extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            cost: ability.costs.payHonor(3),
            condition: this.game.currentConflict,
            max: ability.limit.perRound(1),
            clickToActivate: true,
            target: {
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && card.getCost() < 3 && card.allowGameAction('discardCardFromPlay')
            },
            handler: context => {
                this.game.addMessage('{0} pays 3 honor to use {1} to discard {2}', this.controller, this, context.target);
                context.target.owner.discardCardFromPlay(context.target);
            }
        });
    }
}

Assassination.id = 'assassination';

module.exports = Assassination;
