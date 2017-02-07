const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class WeaponsAtTheDoor extends PlotCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: (event, phase) => phase === 'challenge'
            },
            handler: () => {
                _.each(this.game.getPlayers(), player => this.returnCardsToHand(player));

                this.game.addMessage('{0} uses {1} to force both players to return each card with printed attachment card type to their hand', this.controller, this);
            }
        });
    }

    returnCardsToHand(player) {
        player.allCards.each(card => {
            if(card.getType() === 'attachment' && card.parent) {
                player.returnCardToHand(card);
            }
        });
    }
}

WeaponsAtTheDoor.code = '03051';

module.exports = WeaponsAtTheDoor;
