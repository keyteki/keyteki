const DrawCard = require('../../drawcard.js');

class GuestOfHonor extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating(),
            targetController: 'opponent',
            effect: ability.effects.playerCannot(context => context.source.type === 'event')
        });
    }
}

GuestOfHonor.id = 'guest-of-honor';

module.exports = GuestOfHonor;
