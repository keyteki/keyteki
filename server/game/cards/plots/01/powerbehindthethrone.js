const PlotCard = require('../../../plotcard.js');

class PowerBehindTheThrone extends PlotCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard a stand token',
            method: 'discardToken'
        });
    }

    onReveal(player) {
        if(this.controller !== player) {
            return true;
        }

        this.game.addMessage('{0} adds 1 stand token to {1}', player, this);

        this.addToken('stand', 1);

        return true;
    }

    discardToken(player) {
        if(!this.hasToken('stand')) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character to stand',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.controller === player && card.kneeled,
            onSelect: (p, card) => this.onCardSelected(p, card)
        });
    }

    onCardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to remove a stand token and stand {2}', player, this, card);

        card.kneeled = false;

        this.removeToken('stand', 1);

        return true;
    }
}

PowerBehindTheThrone.code = '01018';

module.exports = PowerBehindTheThrone;
