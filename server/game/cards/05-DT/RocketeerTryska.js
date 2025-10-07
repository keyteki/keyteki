import Card from '../../Card.js';

class RocketeerTryska extends Card {
    // (T) While the tide is high, Rocketeer Tryska’s neighbors enter play ready.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: (context) => context.player.isTideHigh(),
            match: () => true,
            effect: ability.effects.entersPlayReady((card, _context, effectContext) =>
                effectContext.source.neighbors.includes(card)
            )
        });
    }
}

RocketeerTryska.id = 'rocketeer-tryska';

export default RocketeerTryska;
