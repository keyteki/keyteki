const _ = require('underscore');

const BaseCardReaction = require('./basecardreaction.js');

/**
 * Represents a reaction ability provided by card text.
 *
 * Properties:
 * when    - object whose keys are event names to listen to for the reaction and
 *           whose values are functions that return a boolean about whether to
 *           trigger the reaction when that event is fired. For example, to
 *           trigger only at the end of the challenge phase, you would do:
 *           when: {
 *               onPhaseEnded: (event, phase) => phase === 'challenge'
 *           }
 *           Multiple events may be specified for cards that have multiple
 *           possible triggers for the same reaction.
 * handler - function that will be executed if the player chooses 'Yes' when
 *           asked to trigger the reaction. If the reaction has more than one
 *           choice, use the choices sub object instead.
 * choices - object whose keys are text to prompt the player and whose values
 *           are handlers when the player chooses it from the prompt.
 * limit   - optional AbilityLimit object that represents the max number of uses
 *           for the reaction as well as when it resets.
 */
class CardReaction extends BaseCardReaction {
    constructor(game, card, properties) {
        super(game, card, properties);

        this.choices = this.createChoices(properties);
    }

    createChoices(properties) {
        if(properties.choices) {
            return properties.choices;
        }

        return { 'Yes': properties.handler };
    }

    executeReaction() {
        this.game.promptWithMenu(this.card.controller, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.card.name + '?',
                buttons: this.buttonsForChoices()
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.card.name
        });
    }

    buttonsForChoices() {
        var buttons = _.map(this.choices, (handler, title) => {
            return { text: title, method: 'triggerReaction', arg: title };
        });
        buttons.push({ text: 'No', method: 'cancel' });
        return buttons;
    }

    triggerReaction(player, choice) {
        var handler = this.choices[choice];

        if(handler && handler() !== false && this.limit) {
            this.limit.increment();
        }

        return true;
    }

    cancel() {
        this.game.addMessage('{0} declines to trigger {1}', this.card.controller, this.card);

        var handler = this.choices['onCancel'];

        if(handler) {
            return handler();
        }

        return true;
    }
}

module.exports = CardReaction;
