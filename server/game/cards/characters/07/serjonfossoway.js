const DrawCard = require('../../../drawcard.js');

class SerJonFossoway extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.getStrength() >= 5,
            match: this,
            effect: ability.effects.addKeyword('Renown')
        });
    }
}

SerJonFossoway.code = '07037';

module.exports = SerJonFossoway;
