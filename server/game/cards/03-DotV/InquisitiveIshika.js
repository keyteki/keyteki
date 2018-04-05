const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class InquisitiveIshika extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentConflict,
            targetType: 'player',
            targetController: 'any',
            effect: ability.effects.reduceCost({ match: card => _.any(this.game.currentConflict.getElements(), element => card.hasTrait(element)) })
        });
    }
}

InquisitiveIshika.id = 'inquisitive-ishika'; // This is a guess at what the id might be - please check it!!!

module.exports = InquisitiveIshika;
