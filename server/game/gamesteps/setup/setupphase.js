const _ = require('underscore');
const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');
const MulliganPrompt = require('./mulliganprompt.js');
const GameStartPrompt = require('./GameStartPrompt');
const Effects = require('../../effects.js');

class SetupPhase extends Phase {
    constructor(game) {
        super(game, 'setup');
        this.initialise([
            new SimpleStep(game, () => this.setupBegin()),
            new GameStartPrompt(game),
            new SimpleStep(game, () => this.drawStartingHands()),
            new SimpleStep(game, () => this.firstPlayerEffects()),
            new MulliganPrompt(game),
            new SimpleStep(game, () => this.startGame())
        ]);
    }

    startPhase() {
        // Don't raise any events without a determined first player
        this.game.currentPhase = this.name;
        for(let step of this.steps) {
            this.game.queueStep(step);
        }
    }

    setupBegin() {
        let allPlayersShuffled = _.shuffle(this.game.getPlayers());
        this.game.activePlayer = allPlayersShuffled.shift();
        for(let card of this.game.allCards) {
            card.applyAnyLocationPersistentEffects();
        }

        for(const player of this.game.getPlayers()) {
            let link = {
                link: 'https://www.keyforgegame.com/deck-details/' + player.deckData.uuid,
                label: player.deckData.name
            };
            if(this.game.gameFormat !== 'sealed') {
                this.game.addMessage('{0} is playing as the Archon: {1}', player, link);
            }
        }
    }

    firstPlayerEffects() {
        this.game.actions.draw({ amount: 1 }).resolve(this.game.activePlayer, this.game.getFrameworkContext());
        this.game.actions.forRemainderOfTurn({
            condition: () => !!this.game.cardsUsed.length || !!this.game.cardsPlayed.length || !!this.game.cardsDiscarded.length,
            effect: Effects.noActiveHouseForPlay()
        }).resolve(this.game.activePlayer, this.game.getFrameworkContext());
    }

    drawStartingHands() {
        _.each(this.game.getPlayers(), player => {
            this.game.actions.draw({ refill: true }).resolve(player, this.game.getFrameworkContext());
        });
    }

    startGame() {
        _.each(this.game.getPlayers(), player => {
            player.readyToStart = true;
        });
        this.game.raiseEvent('onGameStarted');
    }
}

module.exports = SetupPhase;
