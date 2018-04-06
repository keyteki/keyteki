const DrawCard = require('../../drawcard.js');

class DojiShigeru extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Opponent discards a card',
            limit: ability.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: event => event.player === this.controller.opponent && event.card.type === 'event' && 
                                       this.isParticipating()
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to force {2} to choose and discard a card', this.controller, this, this.controller.opponent);
                this.game.promptForSelect(this.controller.opponent, {
                    activePromptTitle: 'Choose a card to discard',
                    source: this,
                    cardCondition: card => card.location === 'hand',
                    onSelect: (player, card) => {
                        player.discardCardsFromHand(card);
                        return true;
                    }
                });
            }
        });
    }
}

DojiShigeru.id = 'doji-shigeru';

module.exports = DojiShigeru;
