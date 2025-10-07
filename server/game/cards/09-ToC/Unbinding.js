import Card from '../../Card.js';
import EventRegistrar from '../../eventregistrar.js';

class Unbinding extends Card {
    // Play: Make a token creature. If a friendly creature was
    // destroyed this turn, archive Unbinding.
    setupCardAbilities(ability) {
        this.creatureDestroyedControllerUuid = {};
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onRoundEnded', 'onCardDestroyed']);

        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.makeTokenCreature(),
                ability.actions.conditional({
                    condition: (context) =>
                        this.creatureDestroyedControllerUuid[context.source.controller.uuid],
                    trueGameAction: ability.actions.archive((context) => ({
                        effect: 'archive {1}',
                        target: context.source
                    }))
                })
            ]),
            effect: 'make a token creature{1}{2}',
            effectArgs: (context) =>
                this.creatureDestroyedControllerUuid[context.source.controller.uuid]
                    ? [' and archive ', context.source]
                    : ['', '']
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

Unbinding.id = 'unbinding';

export default Unbinding;
