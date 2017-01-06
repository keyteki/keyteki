/**
 * Represents an action ability provided by card text.
 *
 * Properties:
 * title        - string that is used within the card menu associated with this
 *                action.
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
class CardAction {
    constructor(game, card, properties) {
        this.game = game;
        this.card = card;
        this.title = properties.title;
        this.limit = properties.limit;
        this.phase = properties.phase || 'any';
        this.anyPlayer = properties.anyPlayer || false;

        this.handler = card[properties.method].bind(card);
    }

    execute(player, arg) {
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

        if(this.handler(player, arg) !== false && this.limit) {
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
