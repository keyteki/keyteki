const BaseAbility = require('./baseability.js');

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
 * limit        - optional AbilityLimit object that represents the max number of
 *                uses for the action as well as when it resets.
 * anyPlayer    - boolean indicating that the action may be executed by a player
 *                other than the card's controller. Defaults to false.
 */
class CardAction extends BaseAbility {
    constructor(game, card, properties) {
        super(game, card, properties);

        this.card = card;
        this.title = properties.title;
        this.limit = properties.limit;
        this.phase = properties.phase || 'any';
        this.anyPlayer = properties.anyPlayer || false;
        this.condition = properties.condition;

        this.handler = this.buildHandler(card, properties);
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

    execute(player, arg) {
        var context = {
            arg: arg,
            game: this.game,
            player: player,
            source: this.card
        };

        if(this.phase !== 'any' && this.phase !== this.game.currentPhase || this.game.currentPhase === 'setup') {
            return;
        }

        if(this.limit && this.limit.isAtMax()) {
            return;
        }

        if(player !== this.card.controller && !this.anyPlayer) {
            return;
        }

        if(this.card.isBlank()) {
            return;
        }

        if(this.condition && !this.condition()) {
            return;
        }

        this.queueResolver(context);
    }

    executeHandler(context) {
        if(this.handler(context) !== false && this.limit) {
            this.limit.increment();
        }
    }

    getMenuItem() {
        return { text: this.title, method: 'doAction', anyPlayer: !!this.anyPlayer };
    }

    registerEvents() {
        if(this.limit) {
            this.limit.registerEvents(this.game);
        }
    }

    unregisterEvents() {
        if(this.limit) {
            this.limit.unregisterEvents(this.game);
        }
    }
}

module.exports = CardAction;
