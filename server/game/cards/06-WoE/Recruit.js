import Card from '../../Card.js';
import EventRegistrar from '../../eventregistrar.js';

class Recruit extends Card {
    // Play: Make a token creature. If you exalted a friendly creature
    // this turn, archive Recruit.
    setupCardAbilities(ability) {
        this.creaturesExalted = {};
        this.creaturesExalted[this.owner.uuid] = 0;
        if (this.owner.opponent) {
            this.creaturesExalted[this.owner.opponent.uuid] = 0;
        }

        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onExalt', 'onPhaseStarted']);

        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.makeTokenCreature(),
                ability.actions.conditional({
                    condition: (context) => this.creaturesExalted[context.player.uuid] >= 1,
                    trueGameAction: ability.actions.archive((context) => ({
                        target: context.source
                    }))
                })
            ]),
            effect: 'make a token creature{1}{2}',
            effectArgs: (context) =>
                this.creaturesExalted[context.player.uuid] >= 1
                    ? [' and archive ', context.source]
                    : ['', '']
        });
    }

    onExalt(event) {
        if (event.card.type === 'creature') {
            this.creaturesExalted[event.card.controller.uuid] += 1;
        }
    }

    onPhaseStarted(event) {
        if (event.phase === 'main') {
            this.creaturesExalted[this.game.activePlayer.uuid] = 0;
            if (this.game.activePlayer.opponent) {
                this.creaturesExalted[this.game.activePlayer.opponent.uuid] = 0;
            }
        }
    }
}

Recruit.id = 'recruit';

export default Recruit;
