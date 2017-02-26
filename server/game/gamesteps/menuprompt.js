const _ = require('underscore');
const UiPrompt = require('./uiprompt.js');

/**
 * General purpose menu prompt. By specifying a context object, the buttons in
 * the active prompt can call the corresponding method on the context object.
 * Methods on the contact object should return true in order to complete the
 * prompt.
 *
 * The properties option object may contain the following:
 * activePrompt       - the full prompt to display for the prompted player.
 * waitingPromptTitle - the title to display for opponents.
 * source             - what is at the origin of the user prompt, usually a card;
 *                      used to provide a default waitingPromptTitle, if missing
 */
class MenuPrompt extends UiPrompt {
    constructor(game, player, context, properties) {
        super(game);
        this.player = player;
        this.context = context;
        if(properties.source && !properties.waitingPromptTitle) {
            properties.waitingPromptTitle = 'Waiting for opponent to use ' + properties.source.name;
        }
        this.properties = properties;
    }

    activeCondition(player) {
        return player === this.player;
    }

    activePrompt() {
        return this.properties.activePrompt;
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    onMenuCommand(player, arg, method) {
        if(player !== this.player) {
            return false;
        }

        if(!this.context[method] || !this.hasMethodButton(method)) {
            return false;
        }

        if(this.context[method](player, arg, method)) {
            this.complete();
        }

        return true;
    }

    hasMethodButton(method) {
        return _.any(this.properties.activePrompt.buttons, button => button.method === method);
    }
}

module.exports = MenuPrompt;
