const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class ValarMorghulis extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
                    this.killAllCharacters(player);
                });
            }
        });
    }

    killAllCharacters(player) {
        var characters = player.filterCardsInPlay(card => card.getType() === 'character');

        _.each(characters, character => {
            player.killCharacter(character);
        });
    }
}

ValarMorghulis.code = '04080';

module.exports = ValarMorghulis;
