const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class Foozle extends Card {
    setupCardAbilities(ability) {
        this.creaturesDestroyed = [];
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onCardDestroyed', 'onRoundEnded']);

        this.reap({
            condition: context => this.creaturesDestroyed.filter(card => card.controller !== context.player.controller).length > 0,
            gameAction: ability.actions.gainAmber()
        });
    }

    onCardDestroyed(event) {
        if(event.clone.type === 'creature' && event.inFight) {
            this.creaturesDestroyed.push(event.clone);
        }
    }

    onRoundEnded() {
        this.creaturesDestroyed = [];
    }
}

Foozle.id = 'foozle';

module.exports = Foozle;
