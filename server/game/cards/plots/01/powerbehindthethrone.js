const PlotCard = require('../../../plotcard.js');

class PowerBehindTheThrone extends PlotCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.menu.push({ text: 'Discard a stand token', command: 'plot', method: 'discardToken' });
    }
    
    onReveal(player) {
        if(!this.inPlay || this.owner !== player) {
            return true;
        }

        this.game.addMessage('{0} adds 1 stand token to {1}', player, this);

        this.addToken('stand', 1);

        return true;
    }

    discardToken(player) {
        var buttons = [{ text: 'Done', command: 'plot', method: 'cancelStand' }];

        this.selecting = true;

        this.game.promptForSelectDeprecated(player, this.onCardSelected.bind(this), 'Select a character to stand', buttons);
    }

    onCardSelected(player, cardId) {
        if(!this.inPlay || this.owner !== player) {
            return false;
        }

        var card = player.findCardInPlayByUuid(cardId);

        if(!card || !card.kneeled) {
            return false;
        }

        this.game.addMessage('{0} uses {1} to remove a stand token and stand {2}', player, this, card);

        card.kneeled = false;

        this.removeToken('stand', 1);

        return true;
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
