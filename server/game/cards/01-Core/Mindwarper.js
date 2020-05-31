const Card = require('../../Card.js');

class Mindwarper extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.capture((context) => ({
                    player: context.player.opponent
                }))
            }
        });
    }
}

Mindwarper.id = 'mindwarper';

module.exports = Mindwarper;
