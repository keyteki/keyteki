const DrawCard = require('../../drawcard.js');

class KitsukiInvestigator extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Look at opponent\'s hand',
            condition: context => context.source.isParticipating() && this.game.isDuringConflict('political') &&
                                  context.player.opponent && context.player.opponent.hand.size() > 0,
            cost: ability.costs.payFateToRing(),
            effect: 'reveal {1}\'s hand: {2}',
            effectArgs: context => [context.player.opponent, context.player.opponent.hand.sortBy(card => card.name)],
            gameAction: ability.actions.discardCard(context => ({
                promptWithHandlerMenu: {
                    cards: context.player.opponent.hand.sortBy(card => card.name),
                    message: '{0} chooses {1} to be discarded'
                }
            })),
            max: ability.limit.perConflict(1)
        });
    }
}

KitsukiInvestigator.id = 'kitsuki-investigator';

module.exports = KitsukiInvestigator;
