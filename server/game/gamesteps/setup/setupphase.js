const _ = require('underscore');
const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');
const MulliganPrompt = require('./mulliganprompt.js');
const AdaptiveDeckSelectionPrompt = require('./AdaptiveDeckSelectionPrompt');
const FirstPlayerSelection = require('./FirstPlayerSelection');
const GameStartPrompt = require('./GameStartPrompt');
const Effects = require('../../effects.js');
const { EVENTS } = require('../../Events/types.js');

class SetupPhase extends Phase {
    constructor(game) {
        super(game, 'setup');
        this.initialise([
            new AdaptiveDeckSelectionPrompt(game),
            new FirstPlayerSelection(game),
            new SimpleStep(game, () => this.setupBegin()),
            new GameStartPrompt(game),
            new SimpleStep(game, () => this.drawStartingHands()),
            new SimpleStep(game, () => this.firstPlayerEffects()),
            new MulliganPrompt(game),
            new SimpleStep(game, () => this.startGame())
        ]);
    }

    startPhase() {
        this.game.currentPhase = this.name;
        for (let step of this.steps) {
            this.game.queueStep(step);
        }

        for (const player of this.game.getPlayers()) {
            let link = {
                link: 'https://www.keyforgegame.com/deck-details/' + player.deckData.uuid,
                argType: 'link',
                label: player.deckData.name
            };
            if (
                !['sealed', 'alliance'].includes(this.game.gameFormat) &&
                !this.game.hideDeckLists
            ) {
                this.game.addMessage(
                    '{0} brings {1}{2} to The Crucible',
                    player,
                    link,
                    player.chains > 0 ? ` with ${player.chains} chains` : ''
                );
            }
        }
    }

    setupBegin() {
        for (let card of this.game.allCards) {
            card.applyAnyLocationPersistentEffects();
        }
    }

    firstPlayerEffects() {
        this.game.actions
            .draw({ amount: 1 })
            .resolve(this.game.activePlayer, this.game.getFrameworkContext());
        this.game.actions
            .untilPlayerTurnEnd({
                condition: () =>
                    !!this.game.cardsUsed.length ||
                    !!this.game.cardsPlayed.length ||
                    !!this.game.cardsDiscarded.length,
                effect: Effects.noActiveHouseForPlay()
            })
            .resolve(this.game.activePlayer, this.game.getFrameworkContext(this.game.activePlayer));
    }

    drawStartingHands() {
        _.each(this.game.getPlayers(), (player) => {
            this.game.actions.shuffleDeck().resolve(player, this.game.getFrameworkContext());
            this.game.actions
                .draw({ refill: true })
                .resolve(player, this.game.getFrameworkContext());
        });
        this.game.startingHandsDrawn = true;
    }

    startGame() {
        _.each(this.game.getPlayers(), (player) => {
            player.readyToStart = true;
        });
        this.game.raiseEvent(EVENTS.onGameStarted);
    }
}

module.exports = SetupPhase;
