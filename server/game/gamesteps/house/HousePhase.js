const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');

class HousePhase extends Phase {
    constructor(game) {
        super(game, 'house');
        this.initialise([
            new SimpleStep(game, () => this.chooseHouse())
        ]);
    }

    chooseHouse() {
        /*
        this.game.promptForHouseSelect(this.game.activePlayer, {
            promptTitle: 'Choose Active House',
            activePromptTitle: 'Choose which house you want to activate this turn',
            houses: this.game.activePlayer.getAvailableHouses(),
            onSelect: house => this.game.activePlayer.activeHouse = house
        });
        */
        this.game.promptWithHandlerMenu(this.game.activePlayer, {
            promptTitle: 'Choose Active House',
            activePromptTitle: 'Choose which house you want to activate this turn',
            choices: this.game.activePlayer.getAvailableHouses(),
            choiceHandler: house => this.game.activePlayer.activeHouse = house
        });
    }
}

module.exports = HousePhase;
