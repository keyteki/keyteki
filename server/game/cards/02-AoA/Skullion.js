const Card = require('../../Card.js');

class Skullion extends Card {
    // Play: Sacrifice a friendly creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a creature to destroy',
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.destroy()
            }
        });
    }
}

Skullion.id = 'skullion';

module.exports = Skullion;
