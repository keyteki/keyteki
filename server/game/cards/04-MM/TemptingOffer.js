const Card = require('../../Card.js');

class TemptingOffer extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.returnToHand()
            },
            then: {
                gameAction: ability.actions.gainAmber((context) => ({
                    target: context.player.opponent
                }))
            }
        });
    }
}

TemptingOffer.id = 'tempting-offer';

module.exports = TemptingOffer;
