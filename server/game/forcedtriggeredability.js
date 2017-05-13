const TriggeredAbility = require('./triggeredability.js');

/**
 * Represents a forced reaction ability provided by card text.
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
 * limit   - optional AbilityLimit object that represents the max number of uses
 *           for the reaction as well as when it resets.
 * location - string indicating the location the card should be in in order
 *            to activate the reaction. Defaults to 'play area'.
 */
class ForcedTriggeredAbility extends TriggeredAbility {
    constructor(game, card, type, properties) {
        super(game, card, type, properties);

        this.handler = properties.handler;
    }

    isForcedAbility() {
        return true;
    }

    executeReaction(context) {
        this.game.registerAbility(this, context);
    }

    executeHandler(context) {
        if(this.handler(context) !== false && this.limit) {
            this.limit.increment();
        }
    }
}

module.exports = ForcedTriggeredAbility;
