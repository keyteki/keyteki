const Card = require('../../Card.js');

class ProjectZYX extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
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
