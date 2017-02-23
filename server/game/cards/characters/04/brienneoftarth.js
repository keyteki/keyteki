const DrawCard = require('../../../drawcard.js');

class BrienneOfTarth extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.cardsInPlay.any(card => card.hasTrait('King') || card.name === 'Catelyn Stark'),
            match: this,
            effect: ability.effects.doesNotKneelAsDefender()
        });
    }
}

BrienneOfTarth.code = '04083';

module.exports = BrienneOfTarth;
