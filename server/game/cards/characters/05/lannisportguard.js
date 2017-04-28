const _ = require('underscore');
const DrawCard = require('../../../drawcard.js');

class LannisportGuard extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal'
            },
            handler: () => {
                _.each(this.game.getPlayers(), player => {
                    player.drawCardsToHand(1);
                });

                this.game.addMessage('{0} uses {1} to have each player draw a card', this.controller, this);
            }
        });
    }
}

LannisportGuard.code = '05016';

module.exports = LannisportGuard;
