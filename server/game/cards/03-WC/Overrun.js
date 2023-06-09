const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class Overrun extends Card {
    // Play: If 3 or more enemy creatures have been destroyed this turn, your opponent loses 2A.
    setupCardAbilities(ability) {
        this.creaturesDestroyed = {};
        this.creaturesDestroyed[this.owner.uuid] = 0;
        if (this.owner.opponent) {
            this.creaturesDestroyed[this.owner.opponent.uuid] = 0;
        }

        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onCardDestroyed', 'onPhaseStarted']);

        this.play({
            condition: (context) =>
                context.player.opponent &&
                this.creaturesDestroyed[context.player.opponent.uuid] >= 3,
            gameAction: ability.actions.loseAmber({ amount: 2 })
        });
    }

    onCardDestroyed(event) {
        if (event.card.type === 'creature') {
            this.creaturesDestroyed[event.card.owner.uuid] += 1;
        }
    }

    onPhaseStarted(event) {
        if (event.phase === 'main') {
            this.creaturesDestroyed[this.game.activePlayer.uuid] = 0;
            if (this.game.activePlayer.opponent) {
                this.creaturesDestroyed[this.game.activePlayer.opponent.uuid] = 0;
            }
        }
    }
}

Overrun.id = 'overrun';

module.exports = Overrun;
