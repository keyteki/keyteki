const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class TheWarchest extends Card {
    setupCardAbilities(ability) {
        this.creaturesDestroyed = [];
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onCardDestroyed', 'onRoundEnded']);

        this.action({
            gameAction: ability.actions.gainAmber(context => ({ amount: this.creaturesDestroyed.filter(card => card.controller !== context.player).length }))
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

TheWarchest.id = 'the-warchest'; // This is a guess at what the id might be - please check it!!!

module.exports = TheWarchest;
