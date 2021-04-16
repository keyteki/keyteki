const Card = require('../../Card.js');

class HarmonicRitual extends Card {
    // Play: Choose a friendly creature. If its left neighbor shares a house with it, gain 1A and repeat this effect on that creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                cardType: 'creature'
            },
            gameAction: ability.actions.gainAmber((context) => {
                let amount = 0;
                let creature = context.target;
                if (!creature) {
                    return { amount };
                }
                let leftNeighbor = creature.leftNeighbor();
                if (leftNeighbor) {
                    if (creature.getHouses().some((house) => leftNeighbor.hasHouse(house))) {
                        return { amount };
                    }
                }

                return { amount };
            }),
            then: (preThenContext) => ({
                condition: () =>
                    preThenContext.target
                        .getHouses()
                        .some((house) => preThenContext.target.leftNeighbor().hasHouse(house)),
                target: preThenContext.target.leftNeighbor(),
                gameAction: ability.actions.resolveAbility(() => ({
                    ability: preThenContext.gameAction
                }))
            })
        });
    }
}

HarmonicRitual.id = 'harmonic-ritual';

module.exports = HarmonicRitual;
