const _ = require('underscore');
const AbilityContext = require('../AbilityContext');
const EffectSource = require('../EffectSource');
const UiPrompt = require('./uiprompt');

/**
 * Drop down menu prompt. Takes an options object with menu options and
 * a handler for each. Handlers should return true in order to complete the
 * prompt.
 *
 * The properties option object may contain the following:
 * options            - an array of name/value pairs
 * handlers           - an array of handlers corresponding to the menu buttons
 * activePromptTitle  - the title that should be used in the prompt for the
 *                      choosing player.
 * waitingPromptTitle - the title to display for opponents.
 * source             - what is at the origin of the user prompt, usually a card;
 *                      used to provide a default waitingPromptTitle, if missing
 */
class OptionsMenuPrompt extends UiPrompt {
    constructor(game, player, properties) {
        super(game);

        this.player = player;
        if (properties.source) {
            if (_.isString(properties.source)) {
                this.promptTitle = properties.source;
            } else {
                this.source = properties.source;
            }
        }

        this.source =
            this.source ||
            (properties.context && properties.context.source) ||
            new EffectSource(game);
        this.promptTitle = this.promptTitle || this.source.name;

        if (!properties.waitingPromptTitle) {
            properties.waitingPromptTitle = 'Waiting for opponent';
        }

        this.properties = properties;
        this.context =
            properties.context ||
            new AbilityContext({ game: game, player: player, source: this.source });
    }

    activeCondition(player) {
        return player === this.player;
    }

    activePrompt() {
        let buttons = [];
        buttons = this.properties.options.map((option) => {
            return { text: option.name, arg: option.value };
        });

        return {
            menuTitle: this.properties.activePromptTitle || 'Select one',
            buttons: buttons,
            controls: [{ type: 'options-select' }],
            promptTitle: this.promptTitle
        };
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    menuCommand(player, arg) {
        let option = this.properties.options.find((option) => option.value === arg);
        if (option && this.properties.optionsHandler) {
            this.properties.optionsHandler(option);
            this.complete();
            return true;
        }

        return false;
    }
}

module.exports = OptionsMenuPrompt;
