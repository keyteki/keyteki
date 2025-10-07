import Card from '../../Card.js';

class DistributorJanoont extends Card {
    // After Fight/After Reap: Move 1A from a creature to another creature.
    setupCardAbilities(ability) {
        this.reap({
            fight: true,
            condition: (context) => context.game.creaturesInPlay.length > 1,
            target: {
                cardType: 'creature',
                gameAction: ability.actions.removeAmber()
            },
            then: (preContext) => ({
                gameAction: ability.actions.placeAmber({
                    promptForSelect: {
                        message: '{0} uses {1} to place 1 amber on {2}',
                        messageArgs: (card) => [preContext.player, preContext.source, card],
                        cardType: 'creature',
                        activePromptTitle: 'Choose another creature',
                        cardCondition: (card) => card !== preContext.target
                    }
                })
            })
        });
    }
}

DistributorJanoont.id = 'distributor-janŏŏnt';

export default DistributorJanoont;
