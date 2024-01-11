const Card = require('../../Card.js');

class BondedAuctioneer extends Card {
    // After Reap: Destroy an artifact. If you do, its controller gains 1A.
    //
    // Scrap: Return an artifact to its owner’s hand.
    setupCardAbilities(ability) {
        this.reap({
            effect: 'destroy {0} and have {1} gain 1 amber',
            effectArgs: (context) => [context.target.controller],
            target: {
                cardType: 'artifact',
                location: 'play area',
                gameAction: ability.actions.destroy()
            },
            then: {
                gameAction: ability.actions.gainAmber((context) => ({
                    target: context.preThenEvent.clone.controller
                }))
            }
        });

        this.scrap({
            target: {
                cardType: 'artifact',
                location: 'play area',
                gameAction: ability.actions.returnToHand()
            }
        });
    }
}

BondedAuctioneer.id = 'bonded-auctioneer';

module.exports = BondedAuctioneer;
