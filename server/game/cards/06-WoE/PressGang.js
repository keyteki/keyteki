import Card from '../../Card.js';
import EventRegistrar from '../../eventregistrar.js';

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
        this.tracker.register(['onCardDestroyed', 'onBeginRound']);

        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.makeTokenCreature(),
                ability.actions.conditional({
                    condition: (context) =>
                        context.player.opponent &&
                        this.creaturesDestroyed[context.player.opponent.uuid] >= 1,
                    trueGameAction: ability.actions.archive((context) => ({
                        target: context.source
                    }))
                })
            ]),
            effect: 'make a token creature{1}{2}',
            effectArgs: (context) =>
                context.player.opponent &&
                this.creaturesDestroyed[context.player.opponent.uuid] >= 1
                    ? [' and archive ', context.source]
                    : ['', '']
        });
    }

    onCardDestroyed(event) {
        if (event.card.type === 'creature') {
            this.creaturesDestroyed[event.card.controller.uuid] += 1;
        }
    }

    onBeginRound() {
        this.creaturesDestroyed[this.game.activePlayer.uuid] = 0;
        if (this.game.activePlayer.opponent) {
            this.creaturesDestroyed[this.game.activePlayer.opponent.uuid] = 0;
        }
    }
}

PressGang.id = 'press-gang';

export default PressGang;
