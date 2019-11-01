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
        let choices = this.game.activePlayer.getAvailableHouses().map(house => {
            return { text: house, icon: house };
        });
        if(choices.length > 0) {
            this.game.promptWithHandlerMenu(this.game.activePlayer, {
                promptTitle: 'Choose Active House',
                activePromptTitle: 'Choose which house you want to activate this turn',
                source: 'House Choice',
                choices: choices,
                choiceHandler: house => {
                    this.game.addMessage('{0} chooses {1} as their active house this turn', this.game.activePlayer, house.text);
                    this.game.raiseEvent(
                        'onChooseActiveHouse',
                        { player: this.game.activePlayer, house: house.text },
                        () => this.game.activePlayer.activeHouse = house.text
                    );
                }
            });
        } else {
            this.game.addMessage('{0} has no legal choices for active house this turn, and so must play without an active house', this.game.activePlayer);
        }
    }

    takeCardsFromArchives() {
        if(this.game.activePlayer.archives.length) {
            this.game.promptWithHandlerMenu(this.game.activePlayer, {
                source: 'Access Archives',
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
