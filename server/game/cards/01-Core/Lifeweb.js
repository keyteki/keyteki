const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class Lifeweb extends Card {
    // Play: If your opponent played 3or more creatures on their previous turn, steal 2A.
    setupCardAbilities(ability) {
        this.creaturesPlayed = {};
        this.creaturesPlayed[this.owner.uuid] = [];
        if (this.owner.opponent) {
            this.creaturesPlayed[this.owner.opponent.uuid] = [];
        }

        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onCardPlayed', 'onCardAttached', 'onPhaseStarted']);

        this.play({
            condition: (context) =>
                context.player.opponent &&
                this.creaturesPlayed[context.player.opponent.uuid] &&
                this.creaturesPlayed[context.player.opponent.uuid].length >= 3,
            gameAction: ability.actions.steal({ amount: 2 })
        });
    }

    onCardPlayed(event) {
        if (event.card.type === 'creature') {
            this.creaturesPlayed[event.player.uuid].push(event.card.uuid);
        }
    }

    onCardAttached(event) {
        // remove any creature that was played as an upgrade
        this.creaturesPlayed[event.player.uuid] = this.creaturesPlayed[event.player.uuid].filter(
            (el) => el !== event.card.uuid
        );
    }

    onPhaseStarted(event) {
        if (event.phase === 'main') {
            this.creaturesPlayed[this.game.activePlayer.uuid] = [];
        }
    }
}

Lifeweb.id = 'lifeweb';

module.exports = Lifeweb;
