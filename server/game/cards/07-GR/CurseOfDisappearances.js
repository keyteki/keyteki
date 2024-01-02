const Card = require('../../Card.js');

class CurseOfDisappearances extends Card {
    // Treachery. (This card enters play under your opponent’s control.)
    //
    // At the end of your turn, put a friendly creature into your opponent’s
    // archives. If that card leaves their archives, put it into its owner's
    // hand instead.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetController: 'any',
            effect: [ability.effects.entersPlayUnderOpponentsControl()]
        });

        this.interrupt({
            when: {
                onRoundEnded: (_, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.archive({
                promptForSelect: {
                    activePromptTitle: 'Choose a creature to archive',
                    cardType: 'creature',
                    controller: 'self'
                }
            })
        });
    }
}

CurseOfDisappearances.id = 'curse-of-disappearances';

module.exports = CurseOfDisappearances;
