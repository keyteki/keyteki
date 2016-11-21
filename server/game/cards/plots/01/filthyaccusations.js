const PlotCard = require('../../../plotcard.js');

class FilthyAccusations extends PlotCard {
    revealed(player) {
        if(!this.inPlay || this.owner !== player) {
            return true;
        }

        player.menuTitle = 'Select chracter to kneel';
        player.buttons = [{ text: 'Done', command: 'plot', method: 'cancelKneel' }];

        player.selectCard = true;

        this.selecting = true;

        this.game.promptForSelect(player, this.onCardSelected.bind(this));

        return false;
    }

    onCardSelected(player, cardId) {
        if(this.owner !== player || !this.inPlay || !this.selecting) {
            return;
        }

        var card = player.findCardInPlayByUuid(cardId);

        if(!card) {
            var otherPlayer = this.game.getOtherPlayer(player);

            if(!otherPlayer) {
                this.game.playerRevealDone(player);

                return;
            }

            card = otherPlayer.findCardInPlayByUuid(cardId);

            if(!card) {
                this.game.playerRevealDone(player);

                return;
            }
        }

        if(card.getType() !== 'character' || card.kneeled) {
            this.game.playerRevealDone(player);
            return;
        }

        card.kneeled = true;

        this.game.addMessage('{0} uses {1} to kneel {2}', player, this, card);
        
        this.selecting = false;
        this.game.playerRevealDone(player);
    }
}

FilthyAccusations.code = '01011';

module.exports = FilthyAccusations;
