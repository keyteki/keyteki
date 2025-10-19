const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class Overrun extends Card {
    // Play: If 3 or more enemy creatures have been destroyed this turn, your opponent loses 2A.
    setupCardAbilities(ability) {
        this.creaturesDestroyedThisTurn = {};
        this.creaturesDestroyedThisTurn[this.owner.uuid] = 0;
        if (this.owner.opponent) {
            this.creaturesDestroyedThisTurn[this.owner.opponent.uuid] = 0;
        }

        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onCardDestroyed', 'onTurnStart']);

        this.play({
            condition: (context) =>
                context.player.opponent &&
                this.creaturesDestroyedThisTurn[context.player.opponent.uuid] >= 3,
            gameAction: ability.actions.loseAmber({ amount: 2 })
        });
    }

    onCardDestroyed(event) {
        if (event.card.type === 'creature') {
            this.creaturesDestroyedThisTurn[event.card.controller.uuid] += 1;
        }
    }

    onTurnStart() {
        this.creaturesDestroyedThisTurn[this.game.activePlayer.uuid] = 0;
        if (this.game.activePlayer.opponent) {
            this.creaturesDestroyedThisTurn[this.game.activePlayer.opponent.uuid] = 0;
        }
    }
}

Overrun.id = 'overrun';

module.exports = Overrun;
