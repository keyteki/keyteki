const PlotCard = require('../../../plotcard.js');

class PowerBehindTheThrone extends PlotCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.menu.push({ text: 'Discard a stand token', command: 'plot', method: 'discardToken' });
    }

    onReveal(player) {
        if(!this.inPlay || this.controller !== player) {
            return true;
        }

        this.game.addMessage('{0} adds 1 stand token to {1}', player, this);

        this.addToken('stand', 1);

        return true;
    }

    discardToken(player) {
        if(!this.hasToken('stand')) {
            return;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character to stand',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.inPlay && card.controller === player && card.kneeled,
            onSelect: (p, card) => this.onCardSelected(p, card)
        });
    }

    onCardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to remove a stand token and stand {2}', player, this, card);

        card.kneeled = false;

        this.removeToken('stand', 1);

        return true;
    }

    leavesPlay() {
        super.leavesPlay();
    }
}

PowerBehindTheThrone.code = '01018';

module.exports = PowerBehindTheThrone;
