const DrawCard = require('../../drawcard.js');

class WayOfTheCrab extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Make your opponent sacrifice a character',
            condition: context => context.player.opponent && context.player.opponent.cardsInPlay.any(card => card.allowGameAction('sacrifice', context)),
            cost: ability.costs.sacrifice(card => card.type === 'character' && card.isFaction('crab')),
            max: ability.limit.perRound(1),
            handler: context => this.game.promptForSelect(this.controller.opponent, {
                activePromptTitle: 'Choose a character to sacrifice',
                source: this,
                gameAction: 'sacrifice',
                cardCondition: card => card.location === 'play area' && card.controller === this.controller.opponent,
                cardType: 'character',
                onSelect: (player, card) => {
                    this.game.addMessage('{0} sacrifices {1} using {2} to force {3} to sacrifice {4}', this.controller, context.costs.sacrifice, this, player, card);
                    this.game.applyGameAction(context, { sacrifice: card });
                    return true;
                }
            })
        });
    }
}

WayOfTheCrab.id = 'way-of-the-crab';

module.exports = WayOfTheCrab;
