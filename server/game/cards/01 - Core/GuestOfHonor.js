const DrawCard = require('../../drawcard.js');

class GuestOfHonor extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating(),
            targetType: 'player',
            targetController: 'opponent',
            effect: ability.effects.playerCannotTriggerAbilities(card => card.type === 'event')
        });
    }
}

GuestOfHonor.id = 'guest-of-honor';

module.exports = GuestOfHonor;
