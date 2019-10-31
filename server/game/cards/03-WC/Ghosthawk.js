const Card = require('../../Card.js');

class Ghosthawk extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'reap with each of its neighbors in turn',
            gameAction: ability.actions.sequentialForEach(context => ({
                forEach: context.source.neighbors,
                action: () => ability.actions.reap({
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature to reap with',
                        optional: true,
                        cardType: 'creature',
                        cardCondition: c => context.source.neighbors.includes(c),
                        context: context
                    }
                })
            }))
        });
    }
}

Ghosthawk.id = 'ghosthawk';

module.exports = Ghosthawk;
