const Card = require('../../Card.js');
const Houses = require('../../../constants').Houses;
const HousesNames = require('../../../constants').HousesNames;

class GrandAllianceCouncil extends Card {
    // Play: Choose a creature of each house. Destroy each creature not chosen.
    setupCardAbilities(ability) {
        const targets = {};
        for (const house of Houses) {
            targets[house] = {
                activePromptTitle: {
                    text: 'Choose a {{house}} creature to not destroy',
                    values: { house: HousesNames[Houses.indexOf(house)] }
                },
                cardType: 'creature',
                numCards: 1,
                cardCondition: (card) => card.hasHouse(house),
                gameAction: ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay.filter(
                        (card) => context.targets[house] !== card && card.hasHouse(house)
                    )
                }))
            };
        }

        this.play({
            targets: targets
        });
    }
}

GrandAllianceCouncil.id = 'grand-alliance-council';

module.exports = GrandAllianceCouncil;
