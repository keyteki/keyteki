const CardAbility = require('./CardAbility.js');
const Costs = require('./costs.js');

/**
 * Represents an action ability provided by card text.
 *
 * Properties:
 * title        - string that is used within the card menu associated with this
 *                action.
 * condition    - optional function that should return true when the action is
 *                allowed, false otherwise. It should generally be used to check
 *                if the action can modify game state (step #1 in ability
 *                resolution in the rules).
 * cost         - object or array of objects representing the cost required to
 *                be paid before the action will activate. See Costs.
 * phase        - string representing which phases the action may be executed.
 *                Defaults to 'any' which allows the action to be executed in
 *                any phase.
 * location     - string indicating the location the card should be in in order
 *                to activate the action. Defaults to 'play area'.
 * limit        - optional AbilityLimit object that represents the max number of
 *                uses for the action as well as when it resets.
 * max          - optional AbilityLimit object that represents the max number of
 *                times the ability by card title can be used. Contrast with
 *                `limit` which limits per individual card.
 * anyPlayer    - boolean indicating that the action may be executed by a player
 *                other than the card's controller. Defaults to false.
 * clickToActivate - boolean that indicates the action should be activated when
 *                   the card is clicked.
 */
class CardAction extends CardAbility {
    constructor(game, card, properties) {
        super(game, card, properties);

        this.abilityType = 'action';
        this.title =
            properties.title ||
            "Use this card's " + (properties.omni ? 'Omni' : 'Action') + ' ability';
        this.condition = properties.condition;
        this.omni = !!properties.omni;
        this.cost = this.cost.concat(Costs.exhaust(), Costs.use());
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if (
            !this.card.checkRestrictions('useAction', context) ||
            !context.player.checkRestrictions('useAction', context)
        ) {
            return 'cannotTrigger';
        } else if (
            !this.card.checkRestrictions('use', context) ||
            !context.player.checkRestrictions('use', context)
        ) {
            return 'cannotTrigger';
        } else if (!ignoredRequirements.includes('location') && !this.isInValidLocation(context)) {
            return 'location';
        } else if (
            !ignoredRequirements.includes('condition') &&
            this.condition &&
            !this.condition(context)
        ) {
            return 'condition';
        } else if (!ignoredRequirements.includes('stunned') && this.card.stunned) {
            return 'stunned';
        }

        return super.meetsRequirements(context);
    }

    isAction() {
        return true;
    }
}

module.exports = CardAction;
