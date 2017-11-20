const DrawCard = require('../../drawcard.js');

class ShosuroActress extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put an opponent\'s character into play',
            cost: ability.costs.sacrificeSelf(),
            condition: () => this.game.currentConflict,
            target: {
                cardType: 'character',
                cardCondition: card => {
                    return (card.owner !== this.controller && card.location.includes('discard pile') && 
                            card.getCost() < 4 && !card.hasTrait('shinobi') && this.controller.canPutIntoPlay(card, true));
                }
            },
            handler: context => {
                this.game.addMessage('{0} sacrifices {1} to put {2} into play under their control', context.cardStateWhenInitiated.controller, this, context.target);
                context.player.putIntoPlay(context.target, true);
            }
        });
    }
}

ShosuroActress.id = 'shosuro-actress';

module.exports = ShosuroActress;
