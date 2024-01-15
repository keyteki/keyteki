const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class CurseOfCowardice extends Card {
    // Treachery.
    //
    // At the end of your turn, if you did not use any creatures to
    // fight this turn, lose 2. If there are no friendly creatures in
    // play, destroy Curse of Cowardice.
    setupCardAbilities(ability) {
        this.fights = 0;
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onFight', 'onRoundEnded']);

        this.interrupt({
            when: {
                onRoundEnded: (_, context) =>
                    context.player === this.game.activePlayer && this.fights === 0
            },
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.player,
                amount: 2
            }))
        });

        this.persistentEffect({
            effect: ability.effects.terminalCondition({
                condition: (context) => context.player.creaturesInPlay.length === 0,
                message: '{0} is destroyed as there are no friendly creatures in play',
                gameAction: ability.actions.destroy()
            })
        });
    }

    onFight() {
        this.fights++;
    }

    onRoundEnded() {
        this.fights = 0;
    }
}

CurseOfCowardice.id = 'curse-of-cowardice';

module.exports = CurseOfCowardice;
