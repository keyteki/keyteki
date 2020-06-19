const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class Alaka extends Card {
    setupCardAbilities(ability) {
        this.creaturesFoughtByPlayer = {};
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['atEndOfTurn', 'onFight']);

        this.persistentEffect({
            location: 'any',
            condition: (context) => this.creaturesFoughtByPlayer[context.source.controller.uuid],
            effect: ability.effects.entersPlayReady()
        });
    }

    atEndOfTurn() {
        this.creaturesFoughtByPlayer = {};
    }

    onFight(event) {
        this.creaturesFoughtByPlayer[event.context.player.uuid] = true;
    }
}

Alaka.id = 'alaka';

module.exports = Alaka;
