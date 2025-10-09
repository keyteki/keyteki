const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class TheWarchest extends Card {
    // Action: Gain 1A for each enemy creature that was destroyed in a fight this turn.
    setupCardAbilities(ability) {
        this.creaturesDestroyed = [];
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onCardDestroyed', 'onRoundEnded']);

        this.action({
            gameAction: ability.actions.gainAmber((context) => ({
                amount: this.creaturesDestroyed.filter((card) => card.controller !== context.player)
                    .length
            }))
        });
    }

    onCardDestroyed(event) {
        if (event.damageEvent && event.damageEvent.fightEvent && event.clone.type === 'creature') {
            this.creaturesDestroyed.push(event.clone);
        }
    }

    onRoundEnded() {
        this.creaturesDestroyed = [];
    }
}

TheWarchest.id = 'the-warchest';

module.exports = TheWarchest;
