import Card from '../../Card.js';

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
                if (creature) {
                    let creatures = creature.controller.creaturesInPlay;
                    let index = creatures.indexOf(creature);

                    while (index > 0) {
                        let leftNeighbor = creatures[index - 1];
                        if (creature.getHouses().some((house) => leftNeighbor.hasHouse(house))) {
                            amount += 1;
                        } else {
                            break;
                        }
                        creature = leftNeighbor;
                        --index;
                    }
                }

                return {
                    amount: amount
                };
            })
        });
    }
}

HarmonicRitual.id = 'harmonic-ritual';

export default HarmonicRitual;
