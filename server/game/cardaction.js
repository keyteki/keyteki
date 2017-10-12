const _ = require('underscore');

const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');
const EventRegistrar = require('./eventregistrar.js');
const AbilityLimit = require('./abilitylimit.js');

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
 * method       - string indicating the method on card that should be called
 *                when the action is executed. If this method returns an
 *                explicit `false` value then that execution of the action does
 *                not count toward the limit amount.
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
class CardAction extends BaseAbility {
    constructor(game, card, properties) {
        super(properties);

        this.game = game;
        this.card = card;
        this.title = properties.title;
        this.limit = properties.limit || AbilityLimit.perRound(1);
        this.max = properties.max;
        this.phase = properties.phase || 'any';
        this.anyPlayer = properties.anyPlayer || false;
        this.condition = properties.condition;
        this.clickToActivate = !!properties.clickToActivate;
        this.location = properties.location;
        this.events = new EventRegistrar(game, this);
        this.activationContexts = [];

        this.handler = this.buildHandler(card, properties);

        if(card.getType() === 'event') {
            this.cost.push(Costs.playEvent());
        }

        if(this.max) {
            this.card.owner.registerAbilityMax(this.card.name, this.max);
        }
    }

    buildHandler(card, properties) {
        if(!properties.handler && !card[properties.method]) {
            throw new Error('Actions must have either a `handler` or `method` property.');
        }

        if(properties.handler) {
            return properties.handler;
        }

        return function(context) {
            // TODO: Method-based handlers need to have player and arg sent for
            //       backwards compatibility. These actions should either be
            //       converted to use the handler property, or rewritten to use
            //       the context object directly.
            return card[properties.method].call(card, context.player, context.arg, context);
        };
    }

    allowMenu() {
        return this.card.type === 'character' || this.card.type === 'attachment';
    }

    createContext(player, arg) {
        return {
            arg: arg,
            game: this.game,
            player: player,
            source: this.card
        };
    }

    meetsRequirements(context) {
        if(this.phase !== 'any' && this.phase !== this.game.currentPhase || this.game.currentPhase === 'setup') {
            return false;
        }

        if(!context.player.canInitiateAction) {
            return false;
        }

        if(this.limit && this.limit.isAtMax()) {
            return false;
        }

        if(context.player !== this.card.controller && !this.anyPlayer) {
            return false;
        }

        if(!this.card.canTriggerAbilities(this.location)) {
            return false;
        }

        if(this.card.isBlank()) {
            return false ;
        }

        if(this.condition && !this.condition()) {
            return false;
        }

        return this.canPayCosts(context) && this.canResolveTargets(context);
    }

    execute(player, arg) {
        var context = this.createContext(player, arg);

        if(!this.meetsRequirements(context)) {
            return false;
        }

        this.activationContexts.push(context);

        this.game.resolveAbility(this, context);

        return true;
    }

    executeHandler(context) {
        var success = this.handler(context);
        if(success !== false && this.limit) {
            this.limit.increment();
        }
    }

    getMenuItem(arg) {
        return { text: this.title, method: 'doAction', anyPlayer: !!this.anyPlayer, arg: arg };
    }

    isClickToActivate() {
        return this.clickToActivate;
    }

    isCardPlayed() {
        return this.card.getType() === 'event';
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

    isEventListeningLocation(location) {
        if(location === this.location) {
            return true;
        }

        if(location.includes('deck')) {
            return false;
        }
        
        let type = this.card.getType();
        if(type === 'character' || type === 'attachment') {
            return (location === 'play area');
        } else if(type === 'event') {
            return (location === 'hand');
        } else if(type === 'role' || location.includes('province')) {
            return true;
        }
        return false;
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
