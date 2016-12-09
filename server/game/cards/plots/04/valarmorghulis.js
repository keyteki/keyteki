const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class ValarMorghulis extends PlotCard {
    onReveal(player) {
        if(!this.inPlay || this.controller !== player) {
            return true;
        }

        _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
            this.killAllCharacters(player);
        });

        return true;
    }

    killAllCharacters(player) {
        var characters = player.cardsInPlay.filter(card => card.getType() === 'character');

        _.each(characters, character => {
            player.killCharacter(character);
        });
    }
}

ValarMorghulis.code = '04080';

module.exports = ValarMorghulis;
