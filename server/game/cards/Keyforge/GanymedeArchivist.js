const Card = require('../../Card.js');

class GanymedeArchivist extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                location: 'hand',
                gameAction: ability.actions.archive()
            }
        });
    }
}

GanymedeArchivist.id = 'ganymede-archivist'; // This is a guess at what the id might be - please check it!!!

module.exports = GanymedeArchivist;
