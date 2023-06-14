const Card = require('../../Card.js');

class ProjectZYX extends Card {
    // Fight/Reap: You may play one of your archived cards as if it were in your hand and in the active house.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                optional: true,
                controller: 'self',
                location: 'archives',
                gameAction: ability.actions.playCard()
            }
        });
    }
}

ProjectZYX.id = 'project-zyx';

module.exports = ProjectZYX;
