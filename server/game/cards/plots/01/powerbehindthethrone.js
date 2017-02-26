const PlotCard = require('../../../plotcard.js');

class PowerBehindTheThrone extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.game.addMessage('{0} adds 1 stand token to {1}', this.controller, this);
                this.addToken('stand', 1);
            }
        });
        this.action({
            title: 'Discard a stand token',
            method: 'discardToken'
        });
    }

    discardToken(player) {
        if(!this.hasToken('stand')) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character to stand',
            source: this,
            cardCondition: card => card.location === 'play area' && card.controller === player && card.kneeled,
            onSelect: (p, card) => this.onCardSelected(p, card)
        });
    }

    onCardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to remove a stand token and stand {2}', player, this, card);

        player.standCard(card);

        this.removeToken('stand', 1);

        return true;
    }
}

PowerBehindTheThrone.code = '01018';

module.exports = PowerBehindTheThrone;
