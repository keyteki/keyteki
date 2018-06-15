const DrawCard = require('../../drawcard.js');

class WayOfTheCrab extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Make your opponent sacrifice a character',
            condition: context => context.player.opponent && context.player.opponent.cardsInPlay.any(card => card.allowGameAction('sacrifice', context)),
            cost: ability.costs.sacrifice(card => card.type === 'character' && card.isFaction('crab')),
            max: ability.limit.perRound(1),
            handler: context => {
                if(context.player.opponent.cardsInPlay.any(card => card.allowGameAction('sacrifice', context))) {
                    this.game.promptForSelect(context.player.opponent, {
                        activePromptTitle: 'Choose a character to sacrifice',
                        source: this,
                        gameAction: 'sacrifice',
                        cardCondition: card => card.location === 'play area' && card.controller === context.player.opponent,
                        cardType: 'character',
                        onSelect: (player, card) => {
                            this.game.addMessage('{0} sacrifices {1} using {2} to force {3} to sacrifice {4}', this.controller, context.costs.sacrifice, this, player, card);
                            this.game.applyGameAction(context, { sacrifice: card });
                            return true;
                        }
                    });
                } else {
                    this.game.addMessage('{0} sacrifices {1} using {2}, but {3} has nothing to sacrifice', this.controller, context.costs.sacrifice, this, this.controller.opponent);
                }
            }
        });
    }
}

WayOfTheCrab.id = 'way-of-the-crab';

module.exports = WayOfTheCrab;
