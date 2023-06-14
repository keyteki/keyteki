const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class InformationExchange extends Card {
    // Play: Steal 1. If your opponent stole  from you on their previous turn, steal 2 instead.
    setupCardAbilities(ability) {
        this.amberStolenControllerUuid = {};
        this.activePlayerStoleAmber = false;
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onStealAmber', { 'onRoundEnded:preResolution': 'onRoundEnded' }]);

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
        if (event.player.opponent === this.game.activePlayer) {
            this.activePlayerStoleAmber = true;
        }
    }

    onRoundEnded() {
        this.amberStolenControllerUuid[this.game.activePlayer.uuid] = this.activePlayerStoleAmber;
        this.activePlayerStoleAmber = false;
    }
}

InformationExchange.id = 'information-exchange';

module.exports = InformationExchange;
