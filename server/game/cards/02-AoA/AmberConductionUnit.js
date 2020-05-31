const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class AmberConductionUnit extends Card {
    setupCardAbilities(ability) {
        this.creaturesReaped = 0;
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onPhaseStarted', 'onReap']);

        this.reaction({
            when: {
                onReap: (event, context) =>
                    event.card.type === 'creature' &&
                    event.card.controller !== context.source.controller &&
                    this.creaturesReaped === 1
            },
            gameAction: ability.actions.stun((context) => ({
                target: context.event.card
            }))
        });
    }

    onReap(event) {
        if (event.card.type === 'creature') {
            this.creaturesReaped++;
        }
    }

    onPhaseStarted(event) {
        if (event.phase === 'main') {
            this.creaturesReaped = 0;
        }
    }
}

AmberConductionUnit.id = 'æmber-conduction-unit';

module.exports = AmberConductionUnit;
