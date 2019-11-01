const Card = require('../../Card.js');

class Crassosaurus extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture(context => ({
                promptWithOptionsMenu: {
                    activePromptTitle: 'Choose how many to capture',
                    options: [...Array(10).keys()].map(option => ({ name: option, value: option }))
                }
            }))
        });
    }
}

Crassosaurus.id = 'crassosaurus';

module.exports = Crassosaurus;
