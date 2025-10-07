import Card from '../../Card.js';

class Nautilixian extends Card {
    // Nautilixan cannot be used unless you have used 1 or more
    // friendly Mars creatures this turn.
    //
    // Each friendly Pilot creature cannot be dealt damage or
    // destroyed.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                !this.game.cardsUsed.some(
                    (card) =>
                        card.hasHouse('mars') &&
                        card.type === 'creature' &&
                        card.controller === context.player
                ),
            effect: ability.effects.cardCannot('use')
        });

        this.persistentEffect({
            targetController: 'current',
            match: (card) => card.type === 'creature' && card.hasTrait('pilot'),
            effect: [ability.effects.cardCannot('damage'), ability.effects.cardCannot('destroy')]
        });
    }
}

Nautilixian.id = 'nautilixian';

export default Nautilixian;
