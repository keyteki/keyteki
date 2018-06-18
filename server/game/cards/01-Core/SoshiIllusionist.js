const DrawCard = require('../../drawcard.js');

class SoshiIllusionist extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard status from character',
            cost: ability.costs.payFate(1),
            target: {
                cardType: 'character',
                gameAction: ability.actions.discardStatusToken()
            }
        });
    }
}

SoshiIllusionist.id = 'soshi-illusionist';

module.exports = SoshiIllusionist;
