const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class BattleOfTheBlackwater extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
                    this.removeAllDupes(player);
                });

                this.game.addMessage('{0} uses {1} to have both players discard each duplicate they control', 
                                      this.controller, this);
            }
        });
    }

    removeAllDupes(player) {
        // TODO: This implementation only works for 2 player games. The wording
        // of the card is that you discard each duplicate you and your opponent
        // control, not discarding the dupes on cards you or the opponent
        // control. But for 2 player, discarding each dupe is fine.
        let characters = player.filterCardsInPlay(card => card.dupes.size() > 0);
        _.each(characters, character => {
            while(character.dupes.size() > 0) {
                player.removeDuplicate(character, true);
            }
        });
    }
}

BattleOfTheBlackwater.code = '04120';

module.exports = BattleOfTheBlackwater;
