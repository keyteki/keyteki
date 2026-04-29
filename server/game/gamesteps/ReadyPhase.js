const { EVENTS } = require('../Events/types.js');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');

class ReadyPhase extends Phase {
    /**
     * @param {import('../game')} game
     */
    constructor(game) {
        super(game, 'ready');
        this.initialise([
            new SimpleStep(game, () =>
                game.raiseEvent(
                    EVENTS.onCardsReadied,
                    {
                        player: game.activePlayer,
                        cards: game.activePlayer.cardsInPlay,
                        context: game.getFrameworkContext(game.activePlayer)
                    },
                    (event) => {
                        if (
                            event.player.checkRestrictions('ready', event.context) &&
                            event.cards.length > 0
                        ) {
                            game.addMessage('{0} readies their cards', event.player);
                            game.actions.ready().resolve(event.cards, event.player);
                        }
                    }
                )
            )
        ]);
    }
}

module.exports = ReadyPhase;
