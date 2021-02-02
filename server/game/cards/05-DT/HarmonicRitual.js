const Card = require('../../Card.js');

class HarmonicRitual extends Card {
    //Play: Choose a friendly creature.
    //If its left neighbor shares a house with it, gain 1A and repeat this effect on that creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                cardType: 'creature'
            },
            gameAction: ability.actions.gainAmber((context) => {
                let amount = 0;
                let creature = context.target;
                while (
                    creature &&
                    creature.neighbors[0] &&
                    creature.getHouses().some((house) => creature.neighbors[0].hasHouse(house))
                ) {
                    amount += 1;
                    creature = creature.neighbors[0];
                }
                return {
                    amount: amount
                };
            })
        });
    }
}

HarmonicRitual.id = 'harmonic-ritual';

module.exports = HarmonicRitual;
