const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');

class HousePhase extends Phase {
    constructor(game) {
        super(game, 'draw');
        this.initialise([
            new SimpleStep(game, () => this.chooseHouse())
        ]);
    }

    chooseHouse() {
        this.game.promptForHouseSelect(this.game.activePlayer, {
            houses: this.game.activePlayer.getAvailableHouses(),
            onSelect: house => this.game.activePlayer.activeHouse = house
        });
    }
}

module.exports = HousePhase;
