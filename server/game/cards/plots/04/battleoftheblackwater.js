const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class BattleOfTheBlackwater extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
                    this.removeAllDupes(player);
                });
            }
        });
    }

    removeAllDupes(player) {
        var characters = player.filterCardsInPlay(card => card.dupes.size() > 0);
        _.each(characters, character => {
            while(character.dupes.size() > 0) {
                player.removeDuplicate(character);
            }
        });
    }
}

BattleOfTheBlackwater.code = '04120';

module.exports = BattleOfTheBlackwater;
