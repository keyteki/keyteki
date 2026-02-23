import Card from '../../Card.js';
class CurseOfSpontaneity extends Card {
    // Treachery. (This card enters play under your opponent’s control.)
    //
    // At the start of your "draw cards" step, discard your hand.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPhaseStarted: (event, context) =>
                    context.player === this.game.activePlayer && event.phase === 'draw'
            },
            gameAction: ability.actions.discardEntireLocation((context) => ({
                location: 'hand',
                target: context.player
            }))
        });
    }
}

CurseOfSpontaneity.id = 'curse-of-spontaneity';

export default CurseOfSpontaneity;
