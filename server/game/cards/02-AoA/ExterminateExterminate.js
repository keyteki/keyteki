const Card = require('../../Card.js');

class ExterminateExterminate extends Card {
    // Play: For each friendly Mars creature you control, destroy a non-Mars creature with lower power.
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy a non-Mars creature for each Mars creature they control',
            gameAction: ability.actions.sequentialForEach((context) => ({
                forEach: context.player.creaturesInPlay.filter((card) => card.hasHouse('mars')),
                action: (card) =>
                    ability.actions.destroy({
                        promptForSelect: {
                            activePromptTitle: 'Choose a creature to destroy',
                            cardType: 'creature',
                            cardCondition: (c) => !c.hasHouse('mars') && c.power < card.power,
                            context: context
                        }
                    })
            }))
        });
    }
}

ExterminateExterminate.id = 'exterminate-exterminate';

module.exports = ExterminateExterminate;
