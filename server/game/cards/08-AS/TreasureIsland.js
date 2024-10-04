const Card = require('../../Card.js');

class TreasureIsland extends Card {
    // Each friendly Skyborn creature gains, “After Reap: Move 1A from
    // your pool to Treasure Island.”
    // You may spend A on Treasure Island as if it were in your pool.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.keyAmber()
        });

        this.persistentEffect({
            match: (card, context) =>
                card.controller === context.source.controller &&
                card.type === 'creature' &&
                card.hasHouse('skyborn'),
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.removeAmber(),
                effect: 'move 1 amber from {1} to {2}',
                effectArgs: (context) => [context.source, this],
                then: {
                    gameAction: ability.actions.placeAmber({
                        target: this
                    })
                }
            })
        });
    }
}

TreasureIsland.id = 'treasure-island';

module.exports = TreasureIsland;
