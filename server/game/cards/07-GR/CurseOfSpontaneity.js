const Card = require('../../Card.js');

class CurseOfSpontaneity extends Card {
    // Treachery. (This card enters play under your opponent’s control.)
    //
    // At the start of your "draw cards" step, discard your hand.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetController: 'any',
            effect: [ability.effects.entersPlayUnderOpponentsControl()]
        });

        this.interrupt({
            when: {
                onPhaseStarted: (event, context) =>
                    context.player === this.game.activePlayer && event.phase === 'draw'
            },
            gameAction: ability.actions.discard((context) => ({
                target: context.player.hand
            }))
        });
    }
}

CurseOfSpontaneity.id = 'curse-of-spontaneity';

module.exports = CurseOfSpontaneity;
