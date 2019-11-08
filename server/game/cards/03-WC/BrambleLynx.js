const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class BrambleLynx extends Card {
    setupCardAbilities(ability) {
        this.creaturesReaped = 0;
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onPhaseStarted', 'onReap']);

        this.constantReaction({
            when: {
                onCardEntersPlay: (event, context) => (event.card === context.source) && this.creaturesReaped
            },
            gameAction: ability.actions.ready()
        });
    }

    onReap(event) {
        if(event.card.type === 'creature') {
            this.creaturesReaped++;
        }
    }

    onPhaseStarted(event) {
        if(event.phase === 'main') {
            this.creaturesReaped = 0;
        }
    }
}

BrambleLynx.id = 'bramble-lynx';

module.exports = BrambleLynx;
