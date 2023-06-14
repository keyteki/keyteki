const Constants = require('../../../constants.js');
const Card = require('../../Card.js');

class GroupthinkTank extends Card {
    // Action: Deal 4D to each creature that shares a house with at least 1 of its neighbors.
    setupCardAbilities(ability) {
        this.action({
            effect:
                'deal 4 damage to each creature that shares a house with at least 1 of its neighbors.',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 4,
                target: context.game.creaturesInPlay.filter(
                    (card) =>
                        card.neighbors.length > 0 &&
                        Constants.Houses.some(
                            (house) =>
                                card.hasHouse(house) &&
                                card.neighbors.some((neighbor) => neighbor.hasHouse(house))
                        )
                )
            }))
        });
    }
}

GroupthinkTank.id = 'groupthink-tank';

module.exports = GroupthinkTank;
