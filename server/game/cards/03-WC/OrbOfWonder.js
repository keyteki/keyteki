const Card = require('../../Card.js');

class OrbOfWonder extends Card {
    setupCardAbilities(ability) {
        this.omni({
            gameAction: ability.actions.sacrifice(),
            then: {
                message: '{0} uses {1} to move a card from their deck to their hand',
                gameAction: ability.actions.moveCard({
                    shuffle: true,
                    reveal: true,
                    destination: 'hand',
                    promptForSelect: {
                        controller: 'self',
                        location: 'deck'
                    }
                })
            }
        });
    }
}

OrbOfWonder.id = 'orb-of-wonder';

module.exports = OrbOfWonder;
