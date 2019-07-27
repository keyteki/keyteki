const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class Lifeweb extends Card {
    setupCardAbilities(ability) {
        this.creaturesPlayed = {};
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onCardPlayed', 'onPhaseStarted']);

        this.play({
            condition: context => context.player.opponent && this.creaturesPlayed[context.player.opponent.uuid].length >= 3,
            gameAction: ability.actions.steal({ amount: 2 })
        });
    }

    onCardPlayed(event) {
        if(event.card.type === 'creature') {
            this.creaturesPlayed[event.player.uuid].push(event.card);
        }
    }

    onPhaseStarted(event) {
        if(event.phase === 'main') {
            this.creaturesPlayed[this.game.activePlayer.uuid] = [];
        }
    }
}

Lifeweb.id = 'lifeweb';

module.exports = Lifeweb;
