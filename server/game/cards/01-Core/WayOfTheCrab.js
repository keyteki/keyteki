const DrawCard = require('../../drawcard.js');

class WayOfTheCrab extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Make your opponent sacrifice a character',
            condition: context => context.player.opponent,
            cost: ability.costs.sacrifice(card => card.type === 'character' && card.isFaction('crab')),
            effect: 'force {1} to sacrifice a character',
            effectArgs: context => context.player.opponent,
            gameAction: ability.actions.sacrifice(context => ({
                promptForSelect: {
                    player: context.player.opponent,
                    activePromptTitle: 'Choose a character to sacrifice',
                    cardType: 'character',
                    controller: 'opponent',
                    message: '{0} sacrifices {1} to {2}',
                    messageArgs: card => [context.player.opponent, card, context.source]
                }
            })),
            max: ability.limit.perRound(1)
        });
    }
}

WayOfTheCrab.id = 'way-of-the-crab';

module.exports = WayOfTheCrab;
