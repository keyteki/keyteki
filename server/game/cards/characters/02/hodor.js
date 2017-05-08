const DrawCard = require('../../../drawcard.js');

class Hodor extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.controller.anyCardsInPlay(card => card.name === 'Bran Stark'),
            match: this,
            effect: ability.effects.cannotBeDeclaredAsAttacker()
        });
        this.persistentEffect({
            match: this,
            effect: ability.effects.doesNotContributeToDominance()
        });
    }
}

Hodor.code = '02061';

module.exports = Hodor;
