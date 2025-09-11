const Card = require('../../Card.js');

class EssenceEntangler extends Card {
    // This creature gets -X power, where X is the number of A on this
    // creature.
    //
    // Scrap: Move 1A from a creature to another creature.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyPower((card) => -card.amber)
        });

        this.scrap({
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

EssenceEntangler.id = 'essence-entangler';

module.exports = EssenceEntangler;
