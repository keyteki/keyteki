const _ = require('underscore');
const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');
const MulliganPrompt = require('./mulliganprompt.js');
const AdaptiveDeckSelectionPrompt = require('./AdaptiveDeckSelectionPrompt');
const ChainBiddingPrompt = require('./ChainBiddingPrompt');
const GameStartPrompt = require('./GameStartPrompt');
const Effects = require('../../effects.js');

class SetupPhase extends Phase {
    constructor(game) {
        super(game, 'setup');
        this.initialise([
            new AdaptiveDeckSelectionPrompt(game),
            new SimpleStep(game, () => this.biddingCheck()),
            new SimpleStep(game, () => this.setupBegin()),
            new GameStartPrompt(game),
            new SimpleStep(game, () => this.drawStartingHands()),
            new SimpleStep(game, () => this.firstPlayerEffects()),
            new MulliganPrompt(game),
            new SimpleStep(game, () => this.startGame())
        ]);
    }

    startPhase() {
        if(!this.game.adaptive) {
            this.game.adaptive = { chains: 0, selection: [], biddingWinner: '', match1Winner: '', match2Winner: '', match3Winner: '' };
        }

        this.game.currentPhase = this.name;
        for(let step of this.steps) {
            this.game.queueStep(step);
        }
    }

    biddingCheck() {
        const [player1, player2] = this.game.adaptive.selection;

        if(!player1) {
            return;
        }

        if(player1.uuid === player2.uuid) {
            this.game.addMessage('Both players have selected {0}. Bidding will start at 0 chains by {1}', player1.deckName, player1.owner);
            this.game.queueStep(new ChainBiddingPrompt(this.game, player1));
        } else {
            this.game.addMessage('Players have selected different decks. Chains will not be bid.');
            if(player1.owner !== player1.name) {
                this.game.reInitialisePlayers(true);
            }
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
                argType: 'link',
                label: player.deckData.name
            };
            if(this.game.gameFormat !== 'sealed' && !this.game.hideDecklists) {
                this.game.addMessage('{0} is playing as the Archon: {1}{2}', player, link, player.chains > 0 ? ` with ${player.chains} chains` : '');
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
