const _ = require('underscore');

const ForcedTriggeredAbilityWindow = require('./forcedtriggeredabilitywindow.js');

class SimultaneousEffectWindow extends ForcedTriggeredAbilityWindow {
    constructor(game) {
        super(game, 'delayedeffects');
    }

    addChoice(choice) {
        if(!choice.condition) {
            choice.condition = () => true;
        }
        this.choices.push(choice);
    }

    filterChoices() {
        let choices = this.choices.filter(choice => choice.condition());
        if(choices.length === 0) {
            return true;
        }
        if(choices.length === 1 || !this.currentPlayer.optionSettings.orderForcedAbilities) {
            this.resolveEffect(choices[0]);
        } else {
            this.promptBetweenChoices(choices);
        }
        return false;
    }

    promptBetweenChoices(choices) {
        this.game.promptWithHandlerMenu(this.currentPlayer, {
            source: 'Order Simultaneous effects',
            activePromptTitle: 'Choose an effect to be resolved',
            waitingPromptTitle: 'Waiting for opponent',
            choices: _.map(choices, choice => choice.title),
            handlers: _.map(choices, choice => (() => this.resolveEffect(choice)))
        });
    }

    resolveEffect(choice) {
        this.choices = this.choices.filter(c => c !== choice);
        choice.handler();
    }
}

module.exports = SimultaneousEffectWindow;
