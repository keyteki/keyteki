const _ = require('underscore');
const AbilityContext = require('../AbilityContext.js');
const EffectSource = require('../EffectSource.js');
const UiPrompt = require('./uiprompt.js');

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
        if (this.properties.cards) {
            buttons = _.map(this.properties.cards, (card) => {
                let text = '{{card}}';
                let values = {
                    card: card.name
                };
                return { text: text, arg: card.uuid, card: card, values: values };
            });
        }

        buttons = buttons.concat(
            _.map(this.properties.choices, (choice, index) => {
                if (_.isObject(choice)) {
                    return { text: choice.text, icon: choice.icon, arg: index };
                }

                return { text: choice, arg: index };
            })
        );

        return {
            menuTitle: this.properties.activePromptTitle || 'Select one',
            buttons: buttons,
            controls: this.getAdditionalPromptControls(),
            promptTitle: this.promptTitle
        };
    }

    getAdditionalPromptControls() {
        if (this.properties.controls && this.properties.controls.type !== 'targeting') {
            return this.properties.controls;
        }

        let targets;
        if (this.properties.controls && this.properties.controls.type === 'targeting') {
            targets = this.properties.controls.targets;
        } else {
            if (!this.context.source.type) {
                return [];
            }

            targets = this.context.targets ? Object.values(this.context.targets) : [];
            targets = targets.reduce((array, target) => array.concat(target), []);
            if (targets.length === 0 && this.context.event && this.context.event.card) {
                this.targets = [this.context.event.card];
            }
        }

        return [
            {
                type: 'targeting',
                source: this.source.getShortSummary(),
                targets: targets.map((target) => target.getShortSummary())
            }
        ];
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    menuCommand(player, arg) {
        if (_.isString(arg)) {
            let card = _.find(this.properties.cards, (card) => card.uuid === arg);
            if (card && this.properties.cardHandler) {
                this.properties.cardHandler(card);
                this.complete();
                return true;
            }

            return false;
        }

        if (this.properties.choiceHandler) {
            this.properties.choiceHandler(this.properties.choices[arg]);
            this.complete();
            return true;
        }

        if (!this.properties.handlers[arg]) {
            return false;
        }

        this.properties.handlers[arg]();
        this.complete();

        return true;
    }
}

module.exports = HandlerMenuPrompt;
