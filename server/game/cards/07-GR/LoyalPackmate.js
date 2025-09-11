const Card = require('../../Card.js');

class LoyalPackmate extends Card {
    // Enemy creatures cannot be used to fight friendly creatures
    // unless the friendly creature has taunt.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            match: (card) => card.type === 'creature' && !card.getKeywordValue('taunt'),
            effect: ability.effects.cardCannot('attack')
        });
    }
}

LoyalPackmate.id = 'loyal-packmate';

module.exports = LoyalPackmate;
