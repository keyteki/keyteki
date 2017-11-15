const _ = require('underscore');

const CardAbility = require('./CardAbility.js');
const Costs = require('./costs.js');
const EventRegistrar = require('./eventregistrar.js');

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
        this.phase = properties.phase || 'any';
        this.anyPlayer = properties.anyPlayer || false;
        this.condition = properties.condition;
        this.clickToActivate = !!properties.clickToActivate;
        this.events = new EventRegistrar(game, this);
        this.doesNotTarget = properties.doesNotTarget;
        this.activationContexts = [];
        this.abilityIdentifier = this.printedAbility ? this.card.id + this.card.abilities.actions.length : '';
        this.maxIdentifier = this.card.name + this.abilityIdentifier;

        this.cost.push(Costs.useInitiateAction());
        if(this.max) {
            this.card.owner.registerAbilityMax(this.maxIdentifier, this.max);
            this.cost.push(Costs.playMax());
        }
    }

    meetsRequirements(context) {
        if(this.phase !== 'any' && this.phase !== this.game.currentPhase) {
            return false;
        }

        if(context.player !== this.card.controller && !this.anyPlayer) {
            return false;
        }

        if(this.condition && !this.condition(context)) {
            return false;
        }

        if(!context.player.canInitiateAction) {
            return false;
        }

        return super.meetsRequirements(context);
    }

    execute(player, arg) {
        var context = this.createContext(player, arg);

        if(!this.meetsRequirements(context)) {
            return false;
        }

        this.activationContexts.push(context);

        this.game.resolveAbility(context);

        return true;
    }

    executeHandler(context) {
        this.handler(context);
    }

    isClickToActivate() {
        return this.clickToActivate;
    }

    deactivate(player) {
        var context = _.last(this.activationContexts);

        if(!context || player !== context.player) {
            return false;
        }

        if(this.canUnpayCosts(context)) {
            this.unpayCosts(context);
            context.abilityDeactivated = true;
            return true;
        }

        return false;
    }

    onBeginRound() {
        this.activationContexts = [];
    }

    registerEvents() {
        this.events.register(['onBeginRound']);
        if(this.limit) {
            this.limit.registerEvents(this.game);
        }
    }

    unregisterEvents() {
        this.events.unregisterAll();
        if(this.limit) {
            this.limit.unregisterEvents(this.game);
        }
    }
}

module.exports = CardAction;
