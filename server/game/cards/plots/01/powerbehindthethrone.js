const PlotCard = require('../../../plotcard.js');

class PowerBehindTheThrone extends PlotCard {
    onReveal(player) {
        if(!this.inPlay || this.owner !== player) {
            return true;
        }

        this.addMessage('{0} adds 1 stand token to {1}', player, this);

        this.addToken('stand', 1);

        return true;
    }

    onClick(player) {
        var buttons = [{ text: 'Done', command: 'plot', method: 'cancelStand' }];

        this.selecting = true;

        this.game.promptForSelect(player, this.onCardSelected.bind(this), 'Select a character to stand', buttons);
    }

    onCardSelected(player, card) {
        if(!this.inPlay || this.owner !== player) {
            return false;
        }

        if(!card || !card.kneeled) {
            return false;
        }

        this.game.addMessage('{0} uses {1} to remove a stand token and stand {2}', player, this, card);
        this.removeToken('stand', 1);
    }

    cancelStand(player) {
        if(!this.inPlay || this.owner !== player) {
            return;
        }

        this.game.cancelSelect(player);
    }

    leavesPlay() {
        this.selecting = false;

        super.leavesPlay();
    }
}

PowerBehindTheThrone.code = '01018';

module.exports = PowerBehindTheThrone;
