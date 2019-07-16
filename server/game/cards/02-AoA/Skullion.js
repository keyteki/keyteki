const Card = require('../../Card.js');

class Skullion extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a creature to sacrifice',
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sacrifice()
            }
        });
    }
}

Skullion.id = 'skullion';

module.exports = Skullion;
