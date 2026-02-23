import Card from '../../Card.js';
import EventRegistrar from '../../eventregistrar.js';
class Foozle extends Card {
    // Reap: If an enemy creature has been destroyed this turn, gain 1A.
    setupCardAbilities(ability) {
        this.creatureDestroyedControllerUuid = {};
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onCardDestroyed', 'onTurnEnd']);

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

    onTurnEnd() {
        this.creatureDestroyedControllerUuid = {};
    }
}

Foozle.id = 'foozle';

export default Foozle;
