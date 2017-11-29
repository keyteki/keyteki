const DrawCard = require('../../drawcard.js');

class AgelessCrone extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating(),
            targetType: 'player',
            targetController: 'any',
            effect: ability.effects.increaseCost({
                amount: 1,
                match: card => card.type === 'event'
            })
        });
    }
}

AgelessCrone.id = 'ageless-crone';

module.exports = AgelessCrone;
