const DrawCard = require('../../../drawcard.js');

class BreienneOfTarth extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.cardsInPlay.any(card => card.hasTrait('King') || card.name === 'Catelyn Stark'),
            match: this,
            effect: ability.effects.doesNotKneelAsDefender()
        });
    }
}

BreienneOfTarth.code = '04083';

module.exports = BreienneOfTarth;
