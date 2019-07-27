const Card = require('../../Card.js');

class ExterminateExterminate extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequentialForEach(context => ({
                forEach: context.player.creaturesInPlay.filter(card => card.hasHouse('mars')),
                action: card => ability.actions.destroy({
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature to destroy',
                        cardType: 'creature',
                        cardCondition: c => !c.hasHouse('mars') && c.power < card.power,
                        context: context
                    }
                })
            }))
        });
    }
}

ExterminateExterminate.id = 'exterminate-exterminate';

module.exports = ExterminateExterminate;
