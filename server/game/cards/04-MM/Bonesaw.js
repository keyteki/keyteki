const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class Bonesaw extends Card {
    // If a friendly creature was destroyed this turn, Bonesaw enters play ready.
    setupCardAbilities(ability) {
        this.creatureDestroyedControllerUuid = {};
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onRoundEnded', 'onCardDestroyed']);

        this.persistentEffect({
            location: 'any',
            condition: (context) =>
                this.creatureDestroyedControllerUuid[context.source.controller.uuid],
            effect: ability.effects.entersPlayReady()
        });
    }

    onRoundEnded() {
        this.creatureDestroyedControllerUuid = {};
    }

    onCardDestroyed(event) {
        if (event.clone.type === 'creature') {
            this.creatureDestroyedControllerUuid[event.clone.controller.uuid] = true;
        }
    }
}

Bonesaw.id = 'bonesaw';

module.exports = Bonesaw;
