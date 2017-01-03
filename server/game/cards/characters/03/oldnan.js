const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class OldNan extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPlotFlip']);
    }

    onPlotFlip() {
        if(this.kneeled) {
            return;
        }

        var buttons = _.map(this.game.getPlayers(), player => {
            return { text: player.selectedPlot.name, method: 'plotSelected', arg: player.selectedPlot.uuid };
        });

        buttons.push({ text: 'No Trigger', method: 'cancel' });

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: buttons
            },
            waitingPromptTitle: 'Waiting for opponent to trigger ' + this.name
        });
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }

    plotSelected(player, cardId) {
        if(this.controller !== player) {
            return false;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Select trait to add',
                buttons: [
                    { text: 'Winter', method: 'traitSelected', arg: 'Winter' },
                    { text: 'Summer', method: 'traitSelected', arg: 'Summer'}
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to trigger ' + this.name
        });

        this.selectedCard = cardId;

        return true;
    }

    traitSelected(player, trait) {
        var plotCard = this.game.findAnyCardInAnyList(this.selectedCard);

        if(!plotCard) {
            return false;
        }

        var lowerTrait = trait.toLowerCase();

        if(lowerTrait !== 'summer' && lowerTrait !== 'winter') {
            return false;
        }

        plotCard.addTrait(trait);

        this.game.addMessage('{0} uses {1} to add the {2} trait to {3}', player, this, trait, plotCard);

        this.modifiedPlot = plotCard;
        this.trait = trait;
        player.kneelCard(this);

        this.game.once('onAfterTaxation', () => {
            this.onAfterTaxation();
        });

        return true;
    }

    onAfterTaxation() {
        if(this.modifiedPlot) {
            this.modifiedPlot.removeTrait(this.trait);

            this.modifiedPlot = undefined;
        }
    }
}

OldNan.code = '03010';

module.exports = OldNan;
