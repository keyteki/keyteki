const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const MulliganDynastyPrompt = require('./setup/mulligandynastyprompt.js');
const MulliganConflictPrompt = require('./setup/mulliganconflictprompt.js');
const SetupProvincesPrompt = require('./setup/setupprovincesprompt.js');

class SetupPhase extends Phase {
    constructor(game) {
        super(game, 'setup');
        this.initialise([
            new SimpleStep(game, () => this.setupBegin()),
            new SimpleStep(game, () => this.chooseFirstPlayer()),
            new SimpleStep(game, () => this.attachStronghold()),
            new SetupProvincesPrompt(game),
            new SimpleStep(game, () => this.placeProvinces()),
            new SimpleStep(game, () => this.fillProvinces()),
            new MulliganDynastyPrompt(game),
            new SimpleStep(game, () => this.drawStartingHands()),
            new MulliganConflictPrompt(game),
            new SimpleStep(game, () => this.startGame())
        ]);
    }

    startPhase() {
        // Don't raise any events without a determined first player
        this.game.currentPhase = this.name;
    }

    setupBegin() {
        let allPlayersShuffled = _.shuffle(this.game.getPlayers());

        let firstPlayer = allPlayersShuffled.shift();
        firstPlayer.firstPlayer = true;
    }
    
    chooseFirstPlayer() {
        let firstPlayer = this.game.getFirstPlayer();
        if(firstPlayer.opponent) {
            this.game.promptWithHandlerMenu(firstPlayer, {
                activePromptTitle: 'You won the flip. Do you want to be:',
                source: 'Choose First Player',
                choices: ['First Player', 'Second Player'],
                handlers: [
                    () => firstPlayer.opponent.modifyFate(1), 
                    () => {
                        firstPlayer.modifyFate(1);
                        this.game.setFirstPlayer(firstPlayer.opponent);
                    }
                ]
            });
        }
    }

    attachStronghold() {
        _.each(this.game.getPlayers(), player => {
            player.moveCard(player.stronghold, 'stronghold province');
            if(player.role) {
                player.role.moveTo('role');
            }
        });
    }

    placeProvinces() {
        _.each(this.game.getPlayers(), player => {
            let provinceIterator = 1; 
            for(let card of player.provinceDeck.shuffle()) {
                let destination;
                if(card.selected) {
                    destination = 'stronghold province';
                    card.selected = false;
                } else {
                    destination = 'province ' + provinceIterator;
                    provinceIterator++;
                }
                player.moveCard(card, destination);
            }
            player.hideProvinceDeck = true;
        });
    }

    fillProvinces() {
        _.each(this.game.getPlayers(), player => {
            for(let province of ['province 1', 'province 2', 'province 3', 'province 4']) {
                let card = player.dynastyDeck.first();
                if(card) {
                    player.moveCard(card, province);
                    card.facedown = false;
                }
            }
        });
        this.game.allCards.each(card => {
            card.applyAnyLocationPersistentEffects();
        });
    }

    drawStartingHands() {
        _.each(this.game.getPlayers(), player => player.drawCardsToHand(4));
    }

    startGame() {
        _.each(this.game.getPlayers(), player => {
            player.honor = player.stronghold.cardData.honor;
        });
    }
}

module.exports = SetupPhase;
