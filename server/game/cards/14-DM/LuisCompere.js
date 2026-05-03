const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class LuisCompere extends Card {
    // Elusive.
    // At the end of your opponent's turn, if they drew 2 or more cards during their "draw cards" step, steal 2A.
    setupCardAbilities(ability) {
        this.opponentDrawStepCount = 0;
        this.inOpponentDrawStep = false;
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register([
            'onCardPlaced',
            'onTurnEnd',
            { 'onPhaseStarted:interrupt': 'onPhaseStarting' },
            'onPhaseEnd'
        ]);

        this.interrupt({
            when: {
                onTurnEnd: (event, context) =>
                    event.player === context.source.controller.opponent &&
                    this.opponentDrawStepCount >= 2
            },
            gameAction: ability.actions.steal({ amount: 2 })
        });
    }

    // We can't simply read the onDrawCards event amount, because:
    // - other effects can draw cards during the draw step that don't go
    //   through a single onDrawCards (e.g. Brillix Ponder's scrap during
    //   Curse of Spontaneity's hand discard fires multiple separate draws).
    // - cards drawn against an empty deck may report a non-zero amount on
    //   the event but only actually move 0 or 1 cards to hand.
    // Tracking onCardPlaced with event.drawn while we know the opponent's
    // draw step is active counts the actual cards that landed in hand.
    onPhaseStarting(event) {
        if (event.phase === 'draw' && this.game.activePlayer === this.controller.opponent) {
            this.inOpponentDrawStep = true;
        }
    }

    onPhaseEnd(event) {
        if (event.phase === 'draw') {
            this.inOpponentDrawStep = false;
        }
    }

    onCardPlaced(event) {
        if (
            event.to === 'hand' &&
            event.drawn &&
            event.card.owner === this.controller.opponent &&
            this.inOpponentDrawStep
        ) {
            this.opponentDrawStepCount += 1;
        }
    }

    onTurnEnd() {
        this.opponentDrawStepCount = 0;
    }
}

LuisCompere.id = 'luis-compère';

module.exports = LuisCompere;
