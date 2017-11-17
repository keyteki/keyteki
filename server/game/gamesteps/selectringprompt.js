const _ = require('underscore');
const UiPrompt = require('./uiprompt.js');

/**
 * General purpose prompt that asks the user to select a ring.
 *
 * The properties option object has the following properties:
 * additionalButtons  - array of additional buttons for the prompt.
 * activePromptTitle  - the title that should be used in the prompt for the
 *                      choosing player.
 * waitingPromptTitle - the title that should be used in the prompt for the
 *                      opponent players.
 * ringCondition      - a function that takes a ring and should return a boolean
 *                      on whether that ring is elligible to be selected.
 * onSelect           - a callback that is called as soon as an elligible ring 
 *                      is clicked. If the callback does not return true, the 
 *                      prompt is not marked as complete.
 * onMenuCommand      - a callback that is called when one of the additional
 *                      buttons is clicked.
 * onCancel           - a callback that is called when the player clicks the
 *                      done button without selecting any rings.
 * source             - what is at the origin of the user prompt, usually a card;
 *                      used to provide a default waitingPromptTitle, if missing
 */
class SelectRingPrompt extends UiPrompt {
    constructor(game, choosingPlayer, properties) {
        super(game);

        this.choosingPlayer = choosingPlayer;
        if(properties.source && !properties.waitingPromptTitle) {
            properties.waitingPromptTitle = 'Waiting for opponent to use ' + properties.source.name;
        }

        this.properties = properties;
        _.defaults(this.properties, this.defaultProperties());
        this.selectedRing = null;
    }

    defaultProperties() {
        return {
            buttons: [{ text: 'Done', arg: 'done' }],
            ringCondition: () => true,
            onSelect: () => true,
            onMenuCommand: () => true,
            onCancel: () => true
        };
    }

    activeCondition(player) {
        return player === this.choosingPlayer;
    }

    continue() {
        if(!this.isComplete()) {
            this.highlightSelectableRings();
        }

        return super.continue();
    }

    highlightSelectableRings() {
        let selectableRings = _.filter(this.game.rings, ring => {
            return this.properties.ringCondition(ring);
        });
        this.choosingPlayer.setSelectableRings(selectableRings);
    }

    activePrompt() {
        return {
            source: this.properties.source,
            selectCard: true,
            selectRing: true,
            selectOrder: this.properties.ordered,
            menuTitle: this.properties.activePromptTitle || this.defaultActivePromptTitle(),
            buttons: this.properties.buttons,
            promptTitle: this.properties.source ? this.properties.source.name : undefined
        };
    }

    defaultActivePromptTitle() {
        return 'Choose a ring';
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    onRingClicked(player, ring) {
        if(player !== this.choosingPlayer) {
            return false;
        }

        if(!this.properties.ringCondition(ring)) {
            return true;
        }

        if(this.properties.onSelect(player, ring)) {
            this.complete();
        }
    }

    menuCommand(player, arg) {
        if(arg !== 'done') {
            if(this.properties.onMenuCommand(player, arg)) {
                this.complete();
            }
            return;
        }

        this.properties.onCancel(player);
        this.complete();
    }

    complete() {
        this.choosingPlayer.clearSelectableRings();
        return super.complete();
    }
}

module.exports = SelectRingPrompt;

