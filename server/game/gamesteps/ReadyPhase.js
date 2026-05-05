const { EVENTS } = require('../Events/types.js');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');

class ReadyPhase extends Phase {
    /**
     * @param {import('../game')} game
     */
    constructor(game) {
        super(game, 'ready');
        this.entrenchedToReady = new Set();
        this.initialise([
            new SimpleStep(game, () => this.promptForEntrenched()),
            new SimpleStep(game, () => this.readyCards())
        ]);
    }

    promptForEntrenched() {
        this.entrenchedToReady = new Set();
        const player = this.game.activePlayer;
        const entrenchedCreatures = player.creaturesInPlay.filter(
            (card) => card.exhausted && card.hasKeyword('entrench')
        );

        if (entrenchedCreatures.length === 0) {
            return;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select entrenched creatures to ready',
            source: 'Entrench',
            controls: [],
            mode: 'unlimited',
            cardType: 'creature',
            controller: 'self',
            cardCondition: (card) => entrenchedCreatures.includes(card),
            buttons: [{ text: 'Done', arg: 'done' }],
            onSelect: (_player, cards) => {
                for (const card of cards) {
                    this.entrenchedToReady.add(card);
                }
                return true;
            },
            onMenuCommand: () => true
        });
    }

    readyCards() {
        this.game.raiseEvent(
            EVENTS.onCardsReadied,
            {
                player: this.game.activePlayer,
                cards: this.game.activePlayer.cardsInPlay,
                context: this.game.getFrameworkContext(this.game.activePlayer)
            },
            (event) => {
                if (
                    !event.player.checkRestrictions('ready', event.context) ||
                    event.cards.length === 0
                ) {
                    return;
                }

                const cards = event.cards.filter(
                    (card) =>
                        !card.hasKeyword('entrench') ||
                        !card.exhausted ||
                        this.entrenchedToReady.has(card)
                );

                if (cards.length === 0) {
                    return;
                }

                this.game.addMessage('{0} readies their cards', event.player);
                this.game.actions.ready().resolve(cards, event.player);
            }
        );
    }
}

module.exports = ReadyPhase;
