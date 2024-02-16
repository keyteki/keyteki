const Card = require('../../Card.js');

class Echofly extends Card {
    // Action: Return an action card from your discard pile to your hand.
    //
    // Scrap: Archive the topmost action card from your discard pile.
    setupCardAbilities(ability) {
        this.action({
            target: {
                controller: 'self',
                cardType: 'action',
                location: 'discard',
                gameAction: ability.actions.returnToHand({
                    location: 'discard'
                })
            }
        });

        this.scrap({
            gameAction: ability.actions.archive((context) => ({
                target: context.player.discard.find((c) => c.type === 'action')
            }))
        });
    }
}

Echofly.id = 'echofly';

module.exports = Echofly;
