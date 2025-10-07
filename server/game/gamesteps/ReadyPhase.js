import Phase from './phase.js';
import SimpleStep from './simplestep.js';

class ReadyPhase extends Phase {
    constructor(game) {
        super(game, 'ready');
        this.initialise([
            new SimpleStep(game, () =>
                game.raiseEvent(
                    'onCardsReadied',
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

export default ReadyPhase;
