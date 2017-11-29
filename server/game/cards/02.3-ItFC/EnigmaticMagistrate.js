const DrawCard = require('../../drawcard.js');

class EnigmaticMagistrate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            match: card => card.isParticipating() && (card.getCost() % 2 === 0),
            targetController: 'any',
            effect: ability.effects.cannotCountForResolution()
        });
    }
}

EnigmaticMagistrate.id = 'enigmatic-magistrate';

module.exports = EnigmaticMagistrate;
