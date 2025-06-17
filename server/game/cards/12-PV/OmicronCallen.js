const Card = require('../../Card.js');

class OmicronCallen extends Card {
    // After Reap: Destroy each other creature.
    // Fate: Destroy each friendly creature that does not share a house with at least one of its neighbors.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card !== context.source)
            }))
        });

        this.fate({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.activePlayer.creaturesInPlay.filter((card) => {
                    const neighbors = card.neighbors;
                    if (neighbors.length === 0) {
                        return true;
                    }
                    return !neighbors.some((neighbor) =>
                        card.getHouses().some((house) => neighbor.hasHouse(house))
                    );
                })
            }))
        });
    }
}

OmicronCallen.id = 'omicron-callen';

module.exports = OmicronCallen;
