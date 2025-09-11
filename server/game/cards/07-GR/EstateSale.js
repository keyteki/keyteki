const Card = require('../../Card.js');

class EstateSale extends Card {
    // Play: Purge a non-creature card from your discard pile. If you
    // do, gain 2A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: ['action', 'artifact', 'upgrade'],
                location: 'discard',
                controller: 'self',
                gameAction: ability.actions.purge()
            },
            then: {
                gameAction: ability.actions.gainAmber({ amount: 2 })
            }
        });
    }
}

EstateSale.id = 'estate-sale';

module.exports = EstateSale;
