const Card = require('../../Card.js');

class HayyelTheMerchant extends Card {
    // Each time you play an artifact, gain 1<A>.
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
