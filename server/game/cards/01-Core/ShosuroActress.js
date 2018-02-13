const DrawCard = require('../../drawcard.js');

class ShosuroActress extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put an opponent\'s character into play',
            cost: ability.costs.sacrificeSelf(),
            condition: () => this.game.currentConflict,
            target: {
                cardType: 'character',
                gameAction: 'putIntoConflict',
                cardCondition: card => {
                    return (card.owner !== this.controller && card.location.includes('discard pile') && 
                            card.getCost() < 4 && !card.hasTrait('shinobi'));
                }
            },
            handler: context => {
                this.game.addMessage('{0} sacrifices {1} to put {2} into play under their control', context.cardStateWhenInitiated.controller, this, context.target);
                this.game.applyGameAction(context, { putIntoConflict: context.target });
            }
        });
    }
}

ShosuroActress.id = 'shosuro-actress';

module.exports = ShosuroActress;
