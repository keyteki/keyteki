const Card = require('../../Card.js');
class GrandAllianceCouncil extends Card {
    //Play: Choose a creature of each house. Destroy each creature not chosen.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                savedCreatures: {
                    activePromptTitle: 'Choose creatures from each house to not destroy',
                    cardType: 'creature',
                    mode: 'exactly',
                    numCards: (context) =>
                        context.game.getHousesInPlay(context.game.creaturesInPlay).length,
                    condition: (context) =>
                        context.game.getHousesInPlay(context.target).length ===
                        context.game.getHousesInPlay(context.game.creaturesInPlay).length,
                    gameAction: ability.actions.destroy((context) => ({
                        target: context.game.creaturesInPlay.filter(
                            (card) =>
                                context.targets && !context.targets.savedCreatures.includes(card)
                        )
                    }))
                }
            }
        });
    }
}

GrandAllianceCouncil.id = 'grand-alliance-council';

module.exports = GrandAllianceCouncil;
