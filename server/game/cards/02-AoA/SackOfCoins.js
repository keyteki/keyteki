const Card = require('../../Card.js');

class SackOfCoins extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.dealDamage(
                    context => ({
                        amount: context.player.amber
                    })
                )}
        });
    }
}

SackOfCoins.id = 'sack-of-coins';

module.exports = SackOfCoins;
