const Card = require('../../Card.js');

class HayellTheMerchant extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) => event.card.type === 'artifact' && event.player === context.player
            },
            gameAction: ability.actions.gainAmber()
        });
    }
}

HayellTheMerchant.id = 'hayell-the-merchant'; // This is a guess at what the id might be - please check it!!!

module.exports = HayellTheMerchant;
