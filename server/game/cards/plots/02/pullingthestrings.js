const PlotCard = require('../../../plotcard.js');

class PullingTheStrings extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                if(this.resolving) {
                    return;
                }

                this.game.promptForSelect(this.controller, {
                    cardCondition: card => this.cardCondition(card),
                    activePromptTitle: 'Select a plot',
                    source: this,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    cardCondition(card) {
        return card.getType() === 'plot' && card.location === 'revealed plots' && card.controller !== this.controller && (card.hasTrait('Edict') || card.hasTrait('Kingdom') || card.hasTrait('Scheme'));
    }

    onCardSelected(player, card) {
        card.moveTo('active plot');
        this.resolving = true;

        this.game.addMessage('{0} uses {1} to initiate the when resolved effect of {2}', player, this, card);
        card.controller = player;
        this.controller = null;
        this.game.raiseEvent('onPlotRevealed', player, () => {
            card.controller = card.owner;
            card.moveTo('revealed plots');
            this.controller = player;

            this.resolving = false;
        });

        return true;
    }
}

PullingTheStrings.code = '02084';

module.exports = PullingTheStrings;
