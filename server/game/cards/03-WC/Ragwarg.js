const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class Ragwarg extends Card {
    // After a creature reaps, if it is the first time a creature has reaped this turn, deal 2D to it.
    setupCardAbilities(ability) {
        this.creaturesReaped = 0;
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onPhaseStarted', 'onReap']);

        this.reaction({
            when: {
                onReap: (event) => event.card.type === 'creature' && this.creaturesReaped === 1
            },
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 2,
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

Ragwarg.id = 'ragwarg';

module.exports = Ragwarg;
