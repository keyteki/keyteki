const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');

class HousePhase extends Phase {
    constructor(game) {
        super(game, 'house');
        this.initialise([
            new SimpleStep(game, () => this.chooseHouse()),
            new SimpleStep(game, () => this.takeCardsFromArchives())
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
            choiceHandler: house => {
                this.game.activePlayer.activeHouse = house;
                this.game.addMessage('{0} chooses {1} as their active house this turn', this.game.activePlayer, house);
            }
        });
    }

    takeCardsFromArchives() {
        if(this.game.activePlayer.archives.length) {
            this.game.promptWithHandlerMenu(this.game.activePlayer, {
                promptTitle: 'Access Archives',
                activePromptTitle: 'Do you wish to take all the cards in archives into your hand?',
                choices: ['Yes', 'No'],
                handlers: [
                    () => {
                        this.game.addMessage('{0} moves all the cards in their archives to their hand', this.game.activePlayer);
                        for(let card of this.game.activePlayer.archives) {
                            this.game.activePlayer.moveCard(card, 'hand');
                        }
                    },
                    () => true
                ]
            });
        }
    }
}

module.exports = HousePhase;
