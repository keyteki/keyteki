const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class Bonesaw extends Card {
    setupCardAbilities(ability) {
        this.creatureDestroyedControllerUuid = {};
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['atEndOfTurn', 'onCardDestroyed']);

        this.persistentEffect({
            location: 'any',
            condition: (context) =>
                this.creatureDestroyedControllerUuid[context.source.controller.uuid],
            effect: ability.effects.entersPlayReady()
        });
    }

    atEndOfTurn() {
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
