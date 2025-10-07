import Card from '../../Card.js';
import Constants from '../../../constants.js';
const { Houses, HousesNames } = Constants;

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
                cardCondition: (card) => card.hasHouse(house)
            };
        }

        this.play({
            targets: targets,
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter(
                    (creatureToKill) => !Object.values(context.targets).includes(creatureToKill)
                )
            }))
        });
    }
}

GrandAllianceCouncil.id = 'grand-alliance-council';

export default GrandAllianceCouncil;
