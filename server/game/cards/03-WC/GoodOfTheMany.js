const Card = require('../../Card.js');

class GoodOfTheMany extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter(
                    (card) =>
                        !card.controller.cardsInPlay.some(
                            (otherCard) =>
                                otherCard !== card &&
                                otherCard.getTraits().some((trait) => card.hasTrait(trait))
                        )
                )
            }))
        });
    }
}

GoodOfTheMany.id = 'good-of-the-many';

module.exports = GoodOfTheMany;
