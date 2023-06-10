const Card = require('../../Card.js');

class IgonTheTerrible extends Card {
    // Play: If Igon the Green has not been purged, destroy Igon the Terrible.
    // Fight: Steal 1A.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.purged.filter((card) => card.name === 'Igon the Green').length === 0,
            gameAction: ability.actions.destroy({ target: this })
        });
        this.fight({
            gameAction: ability.actions.steal()
        });
    }
}

IgonTheTerrible.id = 'igon-the-terrible';

module.exports = IgonTheTerrible;
