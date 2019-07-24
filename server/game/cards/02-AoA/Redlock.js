const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class Redlock extends Card {
    setupCardAbilities(ability) {
        this.creaturesPlayed = {};
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onCardPlayed', 'onPhaseStarted']);

        this.interrupt({
            when: {
                onPhaseEnded: (event, context) => event.phase === 'draw' && context.player.opponent === this.game.activePlayer
            },
            condition: context => this.creaturesPlayed[context.player.uuid].length <= 0,
            gameAction: ability.actions.gainAmber()
        });
    }
}

Redlock.id = 'redlock';

module.exports = Redlock;
