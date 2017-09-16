const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const ActionWindow = require('./actionwindow.js');
const EndRoundPrompt = require('./regroup/endroundprompt.js');

/*
V Regroup Phase
5.1 Regroup phase begins.
    ACTION WINDOW
5.2 Ready cards.
5.3 Discard from provinces.
5.4 Return rings.
5.5 Pass first player token.
5.6 Regroup phase ends.
 */

class RegroupPhase extends Phase {
    constructor(game) {
        super(game, 'regroup');
        this.initialise([
            new ActionWindow(this.game, 'After regroup phase begins', 'beginning'),
            new SimpleStep(game, () => this.readyCards()),
            new SimpleStep(game, () => this.discardFromProvinces()),
            new SimpleStep(game, () => this.returnRings()),
            new SimpleStep(game, () => this.passFirstPlayer()),
            new EndRoundPrompt(game),
            new SimpleStep(game, () => this.roundEnded())
        ]);
    }

    readyCards() {
        this.game.raiseEvent('onReadyAllCards', this, () => {
            _.each(this.game.getPlayers(), player => {
                player.readyCards();
            });
        });
    }
    
    discardFromProvinces() {
        _.each(this.game.getPlayersInFirstPlayerOrder(), player => player.discardFromBrokenProvinces());
        _.each(this.game.getPlayersInFirstPlayerOrder(), player => this.game.promptForSelect(player, {
            numCards: 0,
            multiSelect: true,
            activePromptTitle: 'Select dynasty cards to discard',
            waitingPromptTitle: 'Waiting for opponent to discard dynasty cards',
            cardCondition: card => {
                return (['province 1', 'province 2', 'province 3', 'province 4'].includes(card.location) && 
                        player === card.owner && !card.facedown);
            },
            onSelect: (player, cards) => {
                _.each(cards, card => {
                    let location = card.location;
                    player.moveCard(card, 'dynasty discard pile');
                    player.moveCard(player.dynastyDeck.first(), location);
                });
                return true;
            }
        }));
    }
    
    returnRings() {
        this.game.raiseEvent('onReturnRings', this.game, () => {
            this.game.returnRings();
        });
    }

    passFirstPlayer() {
        this.allPlayers = this.game.getPlayersInFirstPlayerOrder();
        let firstPlayer = this.allPlayers.shift();
        let secondPlayer = this.allPlayers.shift();

        firstPlayer.firstPlayer = false;
        secondPlayer.firstPlayer = true;
    }

    roundEnded() {
        this.game.raiseEvent('onRoundEnded');
    }

}

module.exports = RegroupPhase;
