const DrawCard = require('../../drawcard.js');

class AgashaSwordsmith extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search top 5 card for attachment',
            limit: ability.limit.perRound(1),
            handler: (context) => {
                let properties = {
                    numCards: 5,
                    activePromptTitle: 'Choose a card',
                    waitingPromptTitle: ('Waiting for opponent to use {0}', context.source),
                    cardCondition: card => card.getType() === 'attachment',
                    onSelect: (player, card) => {
                        this.game.addMessage('{0} takes {1} and adds it to their hand', player, card);
                        player.moveCard(card, 'hand');
                        return true;
                    },
                    onCancel: player => {
                        this.game.addMessage('{0} takes nothing', player);
                        return true;
                    },
                    source: context.source
                };
                this.game.promptForDeckSearch(context.player, properties);
            }
        });
    }
}

AgashaSwordsmith.id = 'agasha-swordsmith';

module.exports = AgashaSwordsmith;

