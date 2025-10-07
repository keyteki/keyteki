import Card from '../../Card.js';
import Constants from '../../../constants.js';

class GrandMelee extends Card {
    // Play: Destroy each creature that does not share a house with at least 1 of its neighbors.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter(
                    (card) =>
                        card.neighbors.length === 0 ||
                        !Constants.Houses.some(
                            (house) =>
                                card.hasHouse(house) &&
                                card.neighbors.some((neighbor) => neighbor.hasHouse(house))
                        )
                )
            }))
        });
    }
}

GrandMelee.id = 'grand-melee';

export default GrandMelee;
