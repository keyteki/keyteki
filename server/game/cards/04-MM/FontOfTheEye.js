const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class FontOfTheEye extends Card {
    setupCardAbilities(ability) {
        this.creatureDestroyedControllerUuid = {};
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onCardDestroyed', 'onRoundEnded']);

        this.omni({
            condition: (context) =>
                context.player.opponent &&
                this.creatureDestroyedControllerUuid[context.player.opponent.uuid],
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture({ amount: 1 })
            }
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

FontOfTheEye.id = 'font-of-the-eye';

module.exports = FontOfTheEye;
