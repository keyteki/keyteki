const Card = require('../../Card.js');

class IronObelisk extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(
                () =>
                    this.controller.cardsInPlay.filter(
                        (card) =>
                            card.type === 'creature' &&
                            card.hasHouse('brobnar') &&
                            card.hasToken('damage')
                    ).length
            )
        });
    }
}

IronObelisk.id = 'iron-obelisk';

module.exports = IronObelisk;
