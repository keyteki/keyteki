const Card = require('../../Card.js');

class PandulfTheProvoker extends Card {
    // Play: Enrage an enemy creature
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.enrage()
            }
        });
    }
}

PandulfTheProvoker.id = 'pandulf-the-provoker';

module.exports = PandulfTheProvoker;
