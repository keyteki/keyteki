const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class Lifeweb extends Card {
    setupCardAbilities(ability) {
        this.creaturesPlayed = {};
        this.creaturesPlayed[this.owner.uuid] = 0;
        if (this.owner.opponent) {
            this.creaturesPlayed[this.owner.opponent.uuid] = 0;
        }

        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onCardPlayed', 'onPhaseStarted']);

        this.play({
            condition: (context) =>
                context.player.opponent && this.creaturesPlayed[context.player.opponent.uuid] >= 3,
            gameAction: ability.actions.steal({ amount: 2 })
        });
    }

    onCardPlayed(event) {
        if (event.card.type === 'creature') {
            this.creaturesPlayed[event.player.uuid] += 1;
        }
    }

    onPhaseStarted(event) {
        if (event.phase === 'main') {
            this.creaturesPlayed[this.game.activePlayer.uuid] = 0;
        }
    }
}

Lifeweb.id = 'lifeweb';

module.exports = Lifeweb;
