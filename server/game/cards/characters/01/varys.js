const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class Varys extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onPhaseEnded: (event, phase) => phase === 'dominance'
            },
            handler: () => {
                this.controller.removeCardFromPile(this);
                this.moveTo('out of game');
                _.each(this.game.getPlayers(), player => {
                    player.cardsInPlay.each(card => {
                        if(card.getType() === 'character') {
                            player.discardCard(card);
                        }
                    });
                });
            }
        });
    }
}

Varys.code = '01029';

module.exports = Varys;
