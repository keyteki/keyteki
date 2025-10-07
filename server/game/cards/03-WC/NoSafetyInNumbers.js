import Constants from '../../../constants.js';
import Card from '../../Card.js';

class NoSafetyInNumbers extends Card {
    // Play: Deal 3D to each creature that belongs to a house that has 3 or more creatures in play.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.dealDamage((context) => {
                let countMap = {};
                Constants.Houses.forEach(
                    (house) =>
                        (countMap[house] = context.game.creaturesInPlay.filter((card) =>
                            card.hasHouse(house)
                        ).length)
                );
                return {
                    amount: 3,
                    target: context.game.creaturesInPlay.filter((card) =>
                        Object.entries(countMap).some(
                            (entry) => entry[1] > 2 && card.hasHouse(entry[0])
                        )
                    )
                };
            })
        });
    }
}

NoSafetyInNumbers.id = 'no-safety-in-numbers';

export default NoSafetyInNumbers;
