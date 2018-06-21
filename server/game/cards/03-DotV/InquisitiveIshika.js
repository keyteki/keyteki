const DrawCard = require('../../drawcard.js');

class InquisitiveIshika extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringConflict(),
            targetController: 'any',
            effect: ability.effects.reduceCost({ match: card => this.game.currentConflict.elements.some(element => card.hasTrait(element)) })
        });
    }
}

InquisitiveIshika.id = 'inquisitive-ishika';

module.exports = InquisitiveIshika;
