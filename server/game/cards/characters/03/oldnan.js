const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class OldNan extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPlotFlip: () => true
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                var buttons = _.map(this.game.getPlayers(), player => {
                    return { text: player.selectedPlot.name, method: 'plotSelected', arg: player.selectedPlot.uuid };
                });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select plot to modify',
                        buttons: buttons
                    },
                    waitingPromptTitle: 'Waiting for opponent to trigger ' + this.name
                });
            }
        });
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

        this.game.addMessage('{0} uses {1} to add the {2} trait to {3}', player, this, trait, plotCard);
        this.untilEndOfRound(ability => ({
            match: plotCard,
            effect: ability.effects.addTrait(trait)
        }));

        return true;
    }
}

OldNan.code = '03010';

module.exports = OldNan;
