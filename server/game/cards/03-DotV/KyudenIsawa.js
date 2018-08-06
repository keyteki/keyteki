const StrongholdCard = require('../../strongholdcard.js');

class KyudenIsawa extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Play a spell event from discard',
            cost: ability.costs.bowSelf(),
            condition: () => this.game.isDuringConflict(),
            effect: 'play a spell event from discard',
            gameAction: ability.actions.playCard(context => ({
                promptForSelect: {
                    activePromptTitle: 'Choose a spell event',
                    cardType: 'event',
                    controller: 'self',
                    location: 'conflict discard pile',
                    cardCondition: card => card.hasTrait('spell')
                },
                resetOnCancel: true,
                postHandler: card => {
                    context.game.addMessage('{0} is removed from the game by {1}\'s ability', card, context.source);
                    context.player.moveCard(card, 'removed from game');
                }
            }))
        });
    }
}

KyudenIsawa.id = 'kyuden-isawa';

module.exports = KyudenIsawa;
