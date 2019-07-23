const Card = require('../../Card.js');

class Proclamation346E extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => {
                let houseCount = 0;
                houseCount += this.controller.opponent.cardsInPlay.filter(card => card.type === 'creature' && card.hasHouse('brobnar')).length > 0 ? 1 : 0;
                houseCount += this.controller.opponent.cardsInPlay.filter(card => card.type === 'creature' && card.hasHouse('sanctum')).length > 0 ? 1 : 0;
                houseCount += this.controller.opponent.cardsInPlay.filter(card => card.type === 'creature' && card.hasHouse('mars')).length > 0 ? 1 : 0;
                houseCount += this.controller.opponent.cardsInPlay.filter(card => card.type === 'creature' && card.hasHouse('untamed')).length > 0 ? 1 : 0;
                houseCount += this.controller.opponent.cardsInPlay.filter(card => card.type === 'creature' && card.hasHouse('shadows')).length > 0 ? 1 : 0;
                houseCount += this.controller.opponent.cardsInPlay.filter(card => card.type === 'creature' && card.hasHouse('dis')).length > 0 ? 1 : 0;
                houseCount += this.controller.opponent.cardsInPlay.filter(card => card.type === 'creature' && card.hasHouse('logos')).length > 0 ? 1 : 0;

                return houseCount < 3;
            },
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(2)
        });
    }
}

Proclamation346E.id = 'proclamation-346e';

module.exports = Proclamation346E;
