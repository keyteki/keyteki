const Card = require('../../Card.js');

class DevourWhole extends Card {
    // Play: If a friendly Legendary Keyraken is in play, destroy an enemy creature or artifact.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.creaturesInPlay.some((card) => card.id === 'legendary-keyraken'),
            target: {
                cardType: ['creature', 'artifact'],
                controller: 'opponent',
                gameAction: ability.actions.destroy()
            }
        });
    }
}

DevourWhole.id = 'devour-whole';

module.exports = DevourWhole;
