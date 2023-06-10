const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class BrambleLynx extends Card {
    // Skirmish. (When you use this creature to fight, it is dealt no damage in return.)
    // If you have used a creature to reap this turn, Bramble Lynx enters play ready.
    setupCardAbilities(ability) {
        this.creaturesReapedByPlayer = {};
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onRoundEnded', 'onReap']);

        this.persistentEffect({
            location: 'any',
            condition: (context) => this.creaturesReapedByPlayer[context.source.controller.uuid],
            effect: ability.effects.entersPlayReady()
        });
    }

    onRoundEnded() {
        this.creaturesReapedByPlayer = {};
    }

    onReap(event) {
        this.creaturesReapedByPlayer[event.context.player.uuid] = true;
    }
}

BrambleLynx.id = 'bramble-lynx';

module.exports = BrambleLynx;
