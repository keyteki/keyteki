const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class PressGang extends Card {
    // Play: Make a token creature. If an enemy creature was destroyed
    // this turn, archive Press Gang.
    setupCardAbilities(ability) {
        this.creaturesDestroyed = {};
        this.creaturesDestroyed[this.owner.uuid] = 0;
        if (this.owner.opponent) {
            this.creaturesDestroyed[this.owner.opponent.uuid] = 0;
        }

        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onCardDestroyed', 'onPhaseStarted']);

        this.play({
            gameAction: [
                ability.actions.makeTokenCreature(),
                ability.actions.conditional({
                    condition: (context) =>
                        context.player.opponent &&
                        this.creaturesDestroyed[context.player.opponent.uuid] >= 1,
                    trueGameAction: ability.actions.archive((context) => ({
                        target: context.source
                    }))
                })
            ]
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

PressGang.id = 'press-gang';

module.exports = PressGang;
