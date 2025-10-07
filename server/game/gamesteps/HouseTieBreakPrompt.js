import AllPlayerPrompt from './allplayerprompt.js';

class HouseTieBreakPrompt extends AllPlayerPrompt {
    constructor(game) {
        super(game);
        this.houseSelected = {};
    }

    completionCondition(player) {
        return this.houseSelected[player.uuid];
    }

    activePrompt(player) {
        return {
            menuTitle: 'Choose a house',
            buttons: player.houses.map((house) => ({ text: house, icon: house, arg: house })),
            promptTitle: 'House tie-break'
        };
    }

    waitingPrompt() {
        return {
            menuTitle: 'Waiting for opponent to choose a house'
        };
    }

    menuCommand(player, arg) {
        if (this.houseSelected[player.uuid]) {
            return false;
        }

        if (arg) {
            player.setTieBreakHouse(arg);
            this.houseSelected[player.uuid] = arg;
            return true;
        }

        return false;
    }
}

export default HouseTieBreakPrompt;
