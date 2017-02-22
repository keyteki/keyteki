const DrawCard = require('../../../drawcard.js');

class Hodor extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.controller.findCardByName(this.controller.cardsInPlay, 'Bran Stark'),
            match: this,
            effect: ability.effects.allowAsAttacker(false)
        });
        this.persistentEffect({
            match: this,
            effect: ability.effects.doesNotContributeToDominance()
        });
    }
}

Hodor.code = '02061';

module.exports = Hodor;
