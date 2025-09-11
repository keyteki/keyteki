const Card = require('../../Card.js');

class BadChemistry extends Card {
    // Play: Stun each creature that shares a house with one or more
    // of its neighbors.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.stun((context) => ({
                target: context.game.creaturesInPlay.filter((c) =>
                    c.getHouses().some((house) => c.neighbors.some((n) => n.hasHouse(house)))
                )
            }))
        });
    }
}

BadChemistry.id = 'bad-chemistry';

module.exports = BadChemistry;
