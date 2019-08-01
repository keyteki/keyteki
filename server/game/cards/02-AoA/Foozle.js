const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class Foozle extends Card {
    setupCardAbilities(ability) {
        this.creaturesDestroyed = [];
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onCardDestroyed', 'onRoundEnded']);

        this.reap({
            condition: context => this.creaturesDestroyed.filter(card => card.controller !== context.player).length > 0,
            gameAction: ability.actions.gainAmber({ amount: 1})
        });
    }

    onCardDestroyed(event) {
        if(event.clone.type === 'creature') {
            this.creaturesDestroyed.push(event.clone);
        }
    }

    onRoundEnded() {
        this.creaturesDestroyed = [];
    }
}

Foozle.id = 'foozle';

module.exports = Foozle;
