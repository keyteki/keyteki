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
                    cardType: 'plot',
                    activePromptTitle: 'Select a plot',
                    source: this,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    cardCondition(card) {
        return card.location === 'revealed plots' && card.controller !== this.controller && (card.hasTrait('Edict') || card.hasTrait('Kingdom') || card.hasTrait('Scheme'));
    }

    onCardSelected(player, card) {
        card.moveTo('active plot');
        this.resolving = true;

        this.game.addMessage('{0} uses {1} to initiate the when resolved effect of {2}', player, this, card);
        card.controller = player;
        this.game.raiseMergedEvent('onPlotsWhenRevealed', { plots: [card] });
        this.game.queueSimpleStep(() => {
            card.controller = card.owner;
            card.moveTo('revealed plots');

            this.resolving = false;
        });

        return true;
    }
}

PullingTheStrings.code = '02084';

module.exports = PullingTheStrings;
