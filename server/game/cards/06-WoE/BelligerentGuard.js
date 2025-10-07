import Card from '../../Card.js';

class BelligerentGuard extends Card {
    // Belligerent Guard enters play ready.
    // Play: Your opponent draws a card.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.entersPlayReady()
        });

        this.play({
            gameAction: ability.actions.draw((context) => ({
                target: context.player.opponent
            }))
        });
    }
}

BelligerentGuard.id = 'belligerent-guard';

export default BelligerentGuard;
