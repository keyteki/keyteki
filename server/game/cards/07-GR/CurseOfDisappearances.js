import Card from '../../Card.js';

class CurseOfDisappearances extends Card {
    // Treachery. (This card enters play under your opponent’s control.)
    //
    // At the end of your turn, put a friendly creature into your opponent’s
    // archives. If that card leaves their archives, put it into its owner's
    // hand instead.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (_, context) => context.player === this.game.activePlayer
            },
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.archive((context) => ({
                promptForSelect: {
                    activePromptTitle: 'Choose a creature to archive',
                    cardType: 'creature',
                    controller: 'self',
                    message: "{0} uses {1} to put {2} into {3}'s archives",
                    messageArgs: (card) => [
                        context.player,
                        context.source,
                        card,
                        context.player.opponent
                    ]
                },
                owner: false,
                opponent: true
            })),
            preferActionPromptMessage: true
        });
    }
}

CurseOfDisappearances.id = 'curse-of-disappearances';

export default CurseOfDisappearances;
