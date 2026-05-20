const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class ReadyAction extends CardGameAction {
    setup() {
        this.name = 'ready';
        this.targetType = ['creature', 'artifact'];
        this.effectMsg = 'ready {0}';
    }

    canAffect(card, context) {
        if (card.game.currentPhase === 'ready' && !card.readiesDuringReadyPhase()) {
            return false;
        }
        return (
            card.location === 'play area' &&
            card.checkRestrictions('ready', context) &&
            super.canAffect(card, context)
        );
    }

    getEventArray(context) {
        // Note: we intentionally do NOT reject already-ready cards in
        // canAffect, so that targeting prompts (e.g. "Ready a creature")
        // still allow picking a ready creature — the effect is just a
        // no-op on it. Filter exhausted state here so onCardsReadied only
        // covers cards that actually transition exhausted -> ready.
        const cards = this.target.filter((card) => card.exhausted && this.canAffect(card, context));
        if (cards.length === 0) {
            return [];
        }
        return [
            this.createEvent(
                EVENTS.onCardsReadied,
                {
                    cards,
                    context: context
                },
                (event) => {
                    for (const card of event.cards) {
                        card.ready();
                    }
                }
            )
        ];
    }

    checkEventCondition(event) {
        return event.cards.length > 0;
    }
}

module.exports = ReadyAction;
