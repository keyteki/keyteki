const Card = require('../../Card.js');

class ProjectZYX extends Card {
    setupCardAbilities(ability) {
        this.reap({
            fight: true,
            target: {
                controller: 'self',
                location: 'archives',
                gameAction: ability.actions.playCard()
            }
        });
    }
}

ProjectZYX.id = 'project-zyx';

module.exports = ProjectZYX;
