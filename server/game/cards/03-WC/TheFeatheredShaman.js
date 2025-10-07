import Card from '../../Card.js';

class TheFeatheredShaman extends Card {
    // Elusive.
    // Fight/Reap: Ward each of The Feathered Shamans neighbors.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            gameAction: ability.actions.ward((context) => ({
                target: context.source.neighbors
            }))
        });
    }
}

TheFeatheredShaman.id = 'the-feathered-shaman';

export default TheFeatheredShaman;
