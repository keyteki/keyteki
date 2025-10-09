const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class FontOfTheEye extends Card {
    // Omni: If an enemy creature was destroyed this turn, a friendly creature captures 1A.
    setupCardAbilities(ability) {
        this.creatureDestroyedControllerUuid = {};
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onCardDestroyed', 'onRoundEnded']);

        this.omni({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture((context) => ({
                    amount:
                        context.player.opponent &&
                        this.creatureDestroyedControllerUuid[context.player.opponent.uuid]
                            ? 1
                            : 0
                }))
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
