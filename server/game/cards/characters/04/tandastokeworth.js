const _ = require('underscore');
const DrawCard = require('../../../drawcard.js');

class TandaStokeworth extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal'
            },
            handler: () => {
                _.each(this.game.getPlayers(), player => {
                    player.gold += 3;
                });

                this.game.addMessage('{0} uses {1} to have each player gain three gold', this.controller, this);
            }
        });
    }
}

TandaStokeworth.code = '04069';

module.exports = TandaStokeworth;
