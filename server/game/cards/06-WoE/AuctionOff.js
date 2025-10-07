import Card from '../../Card.js';

class AuctionOff extends Card {
    // Play: Purge an artifact. Its controller gains 1Aember.
    setupCardAbilities(ability) {
        this.play({
            effect: 'purge {0} and have {1} gain 1 amber',
            effectArgs: (context) => [context.target.controller],
            target: {
                cardType: 'artifact',
                location: 'play area',
                gameAction: [
                    ability.actions.purge(),
                    ability.actions.gainAmber((context) => ({
                        target: context.target ? context.target.controller : []
                    }))
                ]
            }
        });
    }
}

AuctionOff.id = 'auction-off';

export default AuctionOff;
