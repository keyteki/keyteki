const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class Alaka extends Card {
    // If you have used a creature to fight this turn, Alaka enters play ready.
    setupCardAbilities(ability) {
        this.creaturesFoughtByPlayer = {};
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onRoundEnded', 'onFight']);

        this.persistentEffect({
            location: 'any',
            condition: (context) => this.creaturesFoughtByPlayer[context.source.controller.uuid],
            effect: ability.effects.entersPlayReady()
        });
    }

    onRoundEnded() {
        this.creaturesFoughtByPlayer = {};
    }

    onFight(event) {
        this.creaturesFoughtByPlayer[event.context.player.uuid] = true;
    }
}

Alaka.id = 'alaka';

module.exports = Alaka;
