const DrawCard = require('../../drawcard.js');

class BayushiYojiro extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating(),
            targetController: 'any',
            match: card => card.isParticipating(),
            effect: ability.effects.cardCannot('affectedByHonor')
        });
    }
}

BayushiYojiro.id = 'bayushi-yojiro';

module.exports = BayushiYojiro;
