const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class ValarMorghulis extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                let characters = _.chain(this.game.getPlayersInFirstPlayerOrder())
                    .map(player => player.filterCardsInPlay(card => card.getType() === 'character'))
                    .flatten()
                    .value();
                this.game.killCharacters(characters);
            }
        });
    }
}

ValarMorghulis.code = '04080';

module.exports = ValarMorghulis;
