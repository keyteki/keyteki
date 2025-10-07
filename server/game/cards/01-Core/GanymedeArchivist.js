import Card from '../../Card.js';

class GanymedeArchivist extends Card {
    // Reap: Archive a card.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                location: 'hand',
                controller: 'self',
                gameAction: ability.actions.archive()
            }
        });
    }
}

GanymedeArchivist.id = 'ganymede-archivist';

export default GanymedeArchivist;
