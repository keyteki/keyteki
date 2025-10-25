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
        this.tracker.register(['onFight', 'onTurnEnd']);

        this.interrupt({
            when: {
                onTurnEnd: (_, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.player,
                amount: this.fights === 0 ? 2 : 0
            })),
            then: {
                alwaysTriggers: true,
                condition: (context) => context.player.creaturesInPlay.length === 0,
                gameAction: ability.actions.destroy(),
                message: '{1} is destroyed as there are no friendly creatures in play'
            }
        });
    }

    onFight() {
        this.fights++;
    }

    onTurnEnd() {
        this.fights = 0;
    }
}

CurseOfCowardice.id = 'curse-of-cowardice';

module.exports = CurseOfCowardice;
