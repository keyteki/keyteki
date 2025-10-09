const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class Foozle extends Card {
    // Reap: If an enemy creature has been destroyed this turn, gain 1A.
    setupCardAbilities(ability) {
        this.creatureDestroyedControllerUuid = {};
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onCardDestroyed', 'onRoundEnded']);

        this.reap({
            condition: (context) =>
                context.player.opponent &&
                this.creatureDestroyedControllerUuid[context.player.opponent.uuid],
            gameAction: ability.actions.gainAmber()
        });
    }

    onCardDestroyed(event) {
        if (event.clone.type === 'creature') {
            this.creatureDestroyedControllerUuid[event.clone.controller.uuid] = true;
        }
    }

    onRoundEnded() {
        this.creatureDestroyedControllerUuid = {};
    }
}

Foozle.id = 'foozle';

module.exports = Foozle;
