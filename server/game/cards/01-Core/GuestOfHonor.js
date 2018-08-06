const DrawCard = require('../../drawcard.js');

class GuestOfHonor extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating(),
            targetController: 'opponent',
            effect: ability.effects.playerCannot({
                cannot: 'play',
                restricts: 'events',
                source: this
            })
        });
    }
}

GuestOfHonor.id = 'guest-of-honor';

module.exports = GuestOfHonor;
