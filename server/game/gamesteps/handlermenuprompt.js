const _ = require('underscore');
const UiPrompt = require('./uiprompt.js');
const BaseCard = require('../basecard.js');

/**
 * General purpose menu prompt. Takes a choices object with menu options and 
 * a handler for each. Handlers should return true in order to complete the
 * prompt.
 *
 * The properties option object may contain the following:
 * choices            - an array of titles for menu buttons
 * handlers           - an array of handlers corresponding to the menu buttons
 * activePromptTitle  - the title that should be used in the prompt for the
 *                      choosing player.
 * waitingPromptTitle - the title to display for opponents.
 * source             - what is at the origin of the user prompt, usually a card;
 *                      used to provide a default waitingPromptTitle, if missing
 */
class HandlerMenuPrompt extends UiPrompt {
    constructor(game, player, properties) {
        super(game);
        this.player = player;
        if(properties.source instanceof BaseCard) {
            properties.source = properties.source.name;
        }
        if(properties.source && !properties.waitingPromptTitle) {
            properties.waitingPromptTitle = 'Waiting for opponent to use ' + properties.source;
        }
        this.properties = properties;
    }

    activeCondition(player) {
        return player === this.player;
    }

    activePrompt() {
        let buttons = _.map(this.properties.choices, (choice, index) => {
            return { text: choice, arg: index };
        });
        return {
            menuTitle: this.properties.activePromptTitle || 'Select one',
            buttons: buttons,
            promptTitle: this.properties.source ? this.properties.source : undefined
        };
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    onMenuCommand(player, arg) {
        if(player !== this.player) {
            return false;
        }

        this.properties.handlers[arg]();
        this.complete();

        return true;
    }
}

module.exports = HandlerMenuPrompt;
