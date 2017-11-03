const DrawCard = require('../../drawcard.js');

class DojiGiftGiver extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow a character',
            cost: ability.costs.giveFateToOpponent(1),
            condition: () => this.isParticipating() && this.controller.opponent,
            target: {
                player: 'opponent',
                cardType: 'character',
                gameAction: 'bow',
                cardCondition: card => card.isParticipating && card.controller !== this.controller
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to give 1 fate to {2}, forcing them to bow {3}', this.controller, this, this.controller.opponent, context.target);
                this.controller.opponent.bowCard(context.target, context.source);
            }
        });
    }
}

DojiGiftGiver.id = 'doji-gift-giver';

module.exports = DojiGiftGiver;
