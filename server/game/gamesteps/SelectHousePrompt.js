const Constants = require('../../constants.js');
const UIPrompt = require('./uiprompt.js');

class SelectHousePrompt extends UIPrompt {
    constructor(game, player, properties) {
        super(game);
        this.player = player;
        this.properties = properties;
    }

    activeCondition(player) {
        return player === this.player;
    }

    activePrompt() {
        let promptTitle = this.properties.promptTitle || (this.properties.source ? this.properties.source.name : undefined);
        return Object.assign({ promptTitle: promptTitle, controls: this.getControls() }, this.properties);
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    menuCommand(player, arg) {
        if(arg === 'cancel') {
            if(this.properties.onCancel) {
                this.properties.onCancel(player);
            }
        } else if(Constants.Houses.includes(arg)) {
            return this.properties.onSelect(player, arg);
        }

        return false;
    }

    getControls() {
        if(this.properties.houses) {
            return [
                {
                    type: 'house',
                    command: 'menuButton',
                    houses: this.properties.houses,
                    uuid: this.uuid
                }
            ];
        }
    }
}

module.exports = SelectHousePrompt;
