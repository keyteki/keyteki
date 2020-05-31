const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class Overrun extends Card {
    setupCardAbilities(ability) {
        this.creaturesDestroyed = {};
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onCardDestroyed', 'onPhaseStarted']);

        this.play({
            condition: (context) =>
                context.player.opponent &&
                this.creaturesDestroyed[context.player.opponent.uuid].length >= 3,
            gameAction: ability.actions.loseAmber({ amount: 2 })
        });
    }

    onCardDestroyed(event) {
        if (event.card.type === 'creature') {
            this.creaturesDestroyed[event.card.owner.uuid].push(event.card);
        }
    }

    onPhaseStarted(event) {
        if (event.phase === 'main') {
            this.creaturesDestroyed[this.game.activePlayer.uuid] = [];
        }
    }
}

Overrun.id = 'overrun';

module.exports = Overrun;
