const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class AmberConductionUnit extends Card {
    setupCardAbilities(ability) {
        this.creaturesReaped = 0;
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onPhaseStarted']);

        this.reaction({
            when: {
                onReap: (event, context) => {
                    this.creaturesReaped++;
                    return event.card.type === 'creature' && event.card.controller !== context.source.controller && this.creaturesReaped === 1;
                }
            },
            gameAction: ability.actions.stun(context => ({
                target: context.event.card
            }))
        });
    }

    onPhaseStarted(event) {
        if(event.phase === 'main') {
            this.creaturesReaped = 0;
        }
    }
}

AmberConductionUnit.id = 'æmber-conduction-unit';

module.exports = AmberConductionUnit;
