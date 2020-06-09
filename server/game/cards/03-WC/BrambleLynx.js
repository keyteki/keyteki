const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class BrambleLynx extends Card {
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
