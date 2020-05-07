const Card = require('../../Card.js');

class QMechs extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.draw()
        });
        this.destroyed({
            gameAction: ability.actions.archive()
        });
    }
}

QMechs.id = 'q-mechs';

module.exports = QMechs;
