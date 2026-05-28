const { EVENTS } = require('../Events/types.js');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');

class ReadyPhase extends Phase {
    /**
     * @param {import('../game')} game
     */
    constructor(game) {
        super(game, 'ready');
        this.entrenchedToKeepExhausted = new Set();
        this.initialise([
            new SimpleStep(game, () => this.promptForEntrenched()),
            new SimpleStep(game, () => this.readyCards())
        ]);
    }

    promptForEntrenched() {
        this.entrenchedToKeepExhausted = new Set();
        const player = this.game.activePlayer;
        const context = this.game.getFrameworkContext(player);
        if (!player.checkRestrictions('ready', context)) {
            return;
        }
        const entrenchedCreatures = player.creaturesInPlay.filter(
            (card) =>
                card.exhausted &&
                card.hasKeyword('entrench') &&
                card.checkRestrictions('ready', context)
        );

        if (entrenchedCreatures.length === 0) {
            return;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select entrenched creatures to keep exhausted',
            source: 'Entrench',
            controls: [],
            mode: 'unlimited',
            cardType: 'creature',
            controller: 'self',
            cardCondition: (card) => entrenchedCreatures.includes(card),
            buttons: [{ text: 'Done', arg: 'done' }],
            onSelect: (_player, cards) => {
                for (const card of cards) {
                    this.entrenchedToKeepExhausted.add(card);
                }
                return true;
            },
            onMenuCommand: () => true
        });
    }

    // A card readies in the ready phase only if it's currently exhausted,
    // is not an entrenched creature the player declined to ready, has no
    // per-card ready restriction (doesNotReady, cardCannot('ready'), etc.),
    // and passes the player-level ready restriction.
    wouldReadyThisPhase(card, context) {
        return (
            card.exhausted &&
            (!card.hasKeyword('entrench') || !this.entrenchedToKeepExhausted.has(card)) &&
            card.readiesDuringReadyPhase() &&
            card.checkRestrictions('ready', context)
        );
    }

    readyCards() {
        const player = this.game.activePlayer;
        const context = this.game.getFrameworkContext(player);
        if (!player.checkRestrictions('ready', context)) {
            return;
        }
        // Pre-filter to only cards that would actually ready. Doing this
        // BEFORE raising onCardsReadied means listeners (e.g. The Chosen
        // One) only fire when at least one card actually readies — they
        // don't trigger on a phase where everything is blocked by Storm
        // Surge / Thermal Depletion / Frost Giant / etc.
        const cards = player.cardsInPlay.filter((card) => this.wouldReadyThisPhase(card, context));
        if (cards.length === 0) {
            return;
        }
        // Raise a single onCardsReadied event covering every card that's
        // about to ready this step. Step-level listeners (e.g. The Chosen
        // One) can interrupt to mutate or empty `event.cards`; per-card
        // listeners (e.g. Cosmicrux, Giltspine Mesmerist) iterate over
        // `event.cards` in their gameAction.
        this.game.raiseEvent(
            EVENTS.onCardsReadied,
            {
                cards,
                context
            },
            (event) => {
                if (event.cards.length === 0) {
                    return;
                }
                this.game.addMessage('{0} readies their cards', player);
                for (const card of event.cards) {
                    card.ready();
                }
            }
        );
    }
}

module.exports = ReadyPhase;
