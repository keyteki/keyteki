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
 * limit.amount - integer indicating the number of times an action may be
 *                executed per period.
 * limit.period - string indicating how often the action's use count is reset.
 *                Must be either 'challenge', 'phase', or 'round'.
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
        this.useCount = 0;

        this.handler = card[properties.method].bind(card);
    }

    execute(player, arg) {
        if(this.phase !== 'any' && this.phase !== this.game.currentPhase || this.game.currentPhase === 'setup') {
            return;
        }

        if(this.limit && this.useCount >= this.limit.amount) {
            return;
        }

        if(player !== this.card.controller && !this.anyPlayer) {
            return;
        }

        if(this.card.isBlank()) {
            return;
        }

        if(this.handler(player, arg) !== false) {
            this.useCount += 1;
        }
    }

    getMenuItem() {
        return { text: this.title, method: 'doAction', anyPlayer: !!this.anyPlayer };
    }

    reset() {
        this.useCount = 0;
    }

    registerEvents() {
        if(this.limit) {
            this.event = {
                name: this.getPeriodEventName(),
                handler: this.reset.bind(this)
            };
            this.game.on(this.event.name, this.event.handler);
        }
    }

    getPeriodEventName() {
        switch(this.limit.period) {
            case 'challenge':
                return 'onChallengeFinished';
            case 'phase':
                return 'onPhaseEnded';
            case 'round':
                return 'onRoundEnded';
        }

        throw new Error('Unknown period"' + this.limit.period + '" for card ' + this.card.name);
    }

    unregisterEvents() {
        if(this.event) {
            this.game.removeListener(this.event.name, this.event.handler);
            this.event = null;
        }
    }
}

module.exports = CardAction;
