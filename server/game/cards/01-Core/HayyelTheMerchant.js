const Card = require('../../Card.js');

class HayyelTheMerchant extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.type === 'artifact' && event.player === context.player
            },
            gameAction: ability.actions.gainAmber()
        });
    }
}

HayyelTheMerchant.id = 'hayyel-the-merchant';

module.exports = HayyelTheMerchant;
