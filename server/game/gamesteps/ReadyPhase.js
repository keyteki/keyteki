const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');

class ReadyPhase extends Phase {
    constructor(game) {
        super(game, 'ready');
        this.initialise([
            new SimpleStep(game, () =>
                game.raiseEvent(
                    'onCardsReadied',
                    {
                        player: game.activePlayer,
                        context: game.getFrameworkContext(game.activePlayer)
                    },
                    (event) => {
                        if (event.player.checkRestrictions('ready', event.context)) {
                            game.addMessage('{0} readies all of their cards', event.player);
                            game.actions.ready().resolve(event.player.cardsInPlay, event.player);
                        }
                    }
                )
            )
        ]);
    }
}

module.exports = ReadyPhase;
