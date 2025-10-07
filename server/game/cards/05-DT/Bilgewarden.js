import Card from '../../Card.js';

class Bilgewarden extends Card {
    // (T) Play/Reap: If the tide is high, your opponent raises the tide. Otherwise, you raise the tide.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            gameAction: ability.actions.raiseTide((context) => ({
                target: context.player.isTideHigh() ? context.player.opponent : context.player
            })),
            effect: 'raise tide for {1}',
            effectArgs: (context) =>
                context.player.isTideHigh() ? context.player.opponent : context.player
        });
    }
}

Bilgewarden.id = 'bilgewarden';

export default Bilgewarden;
