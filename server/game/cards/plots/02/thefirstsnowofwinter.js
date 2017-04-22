const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class TheFirstSnowOfWinter extends PlotCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: (event, phase) => phase === 'challenge'
            },
            handler: () => {
                _.each(this.game.getPlayers(), player => this.returnCardsToHand(player));

                this.game.addMessage('{0} uses {1} to force both players to return each card with printed cost 3 or lower to their hand', this.controller, this);
            }
        });
    }

    returnCardsToHand(player) {
        let characters = player.filterCardsInPlay(card => card.getType() === 'character' && card.getCost() <= 3);
        _.each(characters, card => {
            player.returnCardToHand(card);
        });
    }
}

TheFirstSnowOfWinter.code = '02079';

module.exports = TheFirstSnowOfWinter;
