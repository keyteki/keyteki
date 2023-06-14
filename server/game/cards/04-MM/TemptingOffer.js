const Card = require('../../Card.js');

class TemptingOffer extends Card {
    // Enhance PT. (These icons have already been added to cards in your deck.)
    // Play: Return an enemy creature to its owners hand. If you do, your opponent gains 1A.
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
