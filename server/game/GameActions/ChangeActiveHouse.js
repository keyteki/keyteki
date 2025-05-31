const GameAction = require('./GameAction');

class AddEventToWindowAction extends GameAction {
    setDefaultProperties() {
        this.house = undefined;
        this.player = undefined;
    }

    setup() {
        super.setup();
        this.effectMsg = 'change their active house to ' + this.house;
    }

    hasLegalTarget(context) {
        this.update(context);

        return !!this.house;
    }

    getEventArray(context) {
        return [
            super.createEvent('unnamedEvent', { house: this.house }, () => {
                if (this.player) {
                    this.player.activeHouse = this.house;
                } else {
                    context.player.activeHouse = this.house;
                }
            })
        ];
    }
}

module.exports = AddEventToWindowAction;
