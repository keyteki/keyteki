const Card = require('../../Card.js');

class CustomsOffice extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.additionalCost(context => {
                if(context.source.type === 'artifact' && context.ability.isCardPlayed()) {
                    return ability.costs.payAmber();
                }
            })
        });
    }
}

CustomsOffice.id = 'customs-office'; // This is a guess at what the id might be - please check it!!!

module.exports = CustomsOffice;
