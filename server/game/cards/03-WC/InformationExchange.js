const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class InformationExchange extends Card {
    setupCardAbilities(ability) {
        this.amberStolenControllerUuid = {};
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onStealAmber', 'atEndOfTurn']);

        this.play({
            gameAction: ability.actions.steal((context) => ({
                amount:
                    context.player.opponent &&
                    this.amberStolenControllerUuid[context.player.opponent.uuid]
                        ? 2
                        : 1
            }))
        });
    }

    onStealAmber(event) {
        if (this.game.activePlayer !== this.controller) {
            this.amberStolenControllerUuid[event.player.opponent.uuid] = true;
        }
    }

    atEndOfTurn() {
        if (this.game.activePlayer !== this.controller) {
            this.amberStolenControllerUuid = {};
        }
    }
}

InformationExchange.id = 'information-exchange';

module.exports = InformationExchange;
