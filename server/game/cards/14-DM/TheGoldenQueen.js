const GiganticCard = require('../../GiganticCard.js');

class TheGoldenQueen extends GiganticCard {
    // (Play only with the other half of The Golden Queen.)
    // Each player refills their hand to 1 additional card during their
    // "draw cards" step.
    // After Fight/After Reap: Each player discards a random card from their
    // hand. For each non-Ekwidon card discarded this way, gain 1A.
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.modifyHandSize(1)
        });

        this.fight({
            reap: true,
            gameAction: ability.actions.discardAtRandom((context) => ({
                target: [context.player, context.player.opponent].filter((p) => !!p)
            })),
            then: (preThenContext) => {
                const cards = (preThenContext.preThenEvents || []).reduce(
                    (acc, e) => acc.concat(e.cards || []),
                    []
                );
                const nonEkwidon = cards.filter((c) => !c.hasHouse('ekwidon')).length;
                return {
                    alwaysTriggers: true,
                    gameAction: ability.actions.gainAmber({ amount: nonEkwidon })
                };
            }
        });
    }
}

TheGoldenQueen.id = 'the-golden-queen';

module.exports = TheGoldenQueen;
