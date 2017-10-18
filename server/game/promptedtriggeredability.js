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
 *               onPhaseEnded: event => event.phase === 'challenge'
 *           }
 *           Multiple events may be specified for cards that have multiple
 *           possible triggers for the same reaction.
 * title   - function that returns the string to be used as the prompt title. If
 *           none provided, then the title will be "Trigger {card name}?".
 * cost    - object or array of objects representing the cost required to be
 *           paid before the action will activate. See Costs.
 * handler - function that will be executed if the player chooses 'Yes' when
 *           asked to trigger the reaction. If the reaction has more than one
 *           choice, use the choices sub object instead.
 * choices - object whose keys are text to prompt the player and whose values
 *           are handlers when the player chooses it from the prompt.
 * limit   - optional AbilityLimit object that represents the max number of uses
 *           for the reaction as well as when it resets.
 * location - string indicating the location the card should be in in order
 *            to activate the reaction. Defaults to 'play area'.
 */
class PromptedTriggeredAbility extends TriggeredAbility {
    constructor(game, card, type, properties) {
        super(game, card, type, properties);

        this.choices = this.createChoices(properties);
        this.prompt = properties.prompt;
    }

    createChoices(properties) {
        var choices = {};

        if(properties.choices) {
            choices = properties.choices;
        } else {
            choices = { 'default': properties.handler };
        }

        return choices;
    }

    getChoices(context) {
        return _.map(this.choices, (handler, prompt) => {
            var text = prompt === 'default' && this.prompt ? this.prompt(context) : prompt;
            return { text: text, choice: prompt };
        });
    }

    executeHandler(context) {
        var handler = this.choices[context.choice];

        if(handler) {
            handler(context);
        }
    }
}

module.exports = PromptedTriggeredAbility;
