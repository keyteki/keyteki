const Card = require('../../Card.js');

class DreadboneDecimus extends Card {
    // Play/Fight: You may exalt Dreadbone Decimus. If you do, destroy a creature with lower power than Dreadbone Decimus.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            optional: true,
            gameAction: ability.actions.exalt(),
            then: (context) => ({
                gameAction: ability.actions.destroy({
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature to destroy',
                        cardType: 'creature',
                        cardCondition: (c) => c.power < context.source.power,
                        context: context
                    }
                })
            })
        });
    }
}

DreadboneDecimus.id = 'dreadbone-decimus';

module.exports = DreadboneDecimus;
