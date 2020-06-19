const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class Foozle extends Card {
    setupCardAbilities(ability) {
        this.creatureDestroyedControllerUuid = {};
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onCardDestroyed', 'atEndOfTurn']);

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

    atEndOfTurn() {
        this.creatureDestroyedControllerUuid = {};
    }
}

Foozle.id = 'foozle';

module.exports = Foozle;
