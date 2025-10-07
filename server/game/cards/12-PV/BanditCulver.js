import Card from '../../Card.js';
import EventRegistrar from '../../eventregistrar.js';

class BanditCulver extends Card {
    // Elusive. Enhance .
    // After you discard a Shadows card, if it is the first time you have discarded a Shadows card this turn, steal 1.
    setupCardAbilities(ability) {
        this.shadowsCardDiscarded = undefined;
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onBeginRound', 'onCardDiscarded']);

        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.card.controller === context.player &&
                    this.shadowsCardDiscarded === event.card
            },
            gameAction: ability.actions.steal()
        });
    }

    onCardDiscarded(event) {
        if (
            event.card.controller === this.controller &&
            event.card.hasHouse('shadows') &&
            event.location === 'hand' &&
            this.shadowsCardDiscarded === undefined
        ) {
            this.shadowsCardDiscarded = event.card;
        }
    }

    onBeginRound() {
        this.shadowsCardDiscarded = undefined;
    }
}

BanditCulver.id = 'bandit-culver';

export default BanditCulver;
