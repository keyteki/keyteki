const _ = require('underscore');

const TriggeredAbility = require('./triggeredability.js');

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
 * title   - function that returns the string to be used as the prompt title. If
 *           none provided, then the title will be "Trigger {card name}?".
 * handler - function that will be executed if the player chooses 'Yes' when
 *           asked to trigger the reaction. If the reaction has more than one
 *           choice, use the choices sub object instead.
 * choices - object whose keys are text to prompt the player and whose values
 *           are handlers when the player chooses it from the prompt.
 * limit   - optional AbilityLimit object that represents the max number of uses
 *           for the reaction as well as when it resets.
 */
class PromptedTriggeredAbility extends TriggeredAbility {
    constructor(game, card, type, properties) {
        super(game, card, type, properties);

        this.choices = this.createChoices(properties);
        this.title = properties.title || (() => 'Trigger ' + this.card.name + '?');
    }

    createChoices(properties) {
        var choices = {};

        if(properties.choices) {
            choices = properties.choices;
        } else {
            choices = { 'Yes': properties.handler };
        }

        if(properties.onCancel) {
            this.onCancel = properties.onCancel;
        }

        return choices;
    }

    executeReaction(context) {
        this.currentContext = context;
        this.game.promptWithMenu(this.card.controller, this, {
            activePrompt: {
                menuTitle: this.title(context),
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

        if(handler && handler(this.currentContext) !== false && this.limit) {
            this.limit.increment();
        }

        return true;
    }

    cancel() {
        this.game.addMessage('{0} declines to trigger {1}', this.card.controller, this.card);

        if(this.onCancel) {
            return this.onCancel();
        }

        return true;
    }
}

module.exports = PromptedTriggeredAbility;
