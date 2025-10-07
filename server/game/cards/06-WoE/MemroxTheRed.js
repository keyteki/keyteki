import Card from '../../Card.js';

class MemroxTheRed extends Card {
    // Your opponent's cards cannot leave your archives.
    //
    // Action: Gain 1Aember for each card in your archives.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.player === context.source.controller,
            location: 'play area',
            effect: ability.effects.opponentCardsCannotLeaveArchives(this)
        });

        this.action({
            effect: 'gain {1} amber for each card in their archives',
            effectArgs: (context) => [context.player.archives.length],
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.player.archives.length
            }))
        });
    }
}

MemroxTheRed.id = 'memrox-the-red';

export default MemroxTheRed;
