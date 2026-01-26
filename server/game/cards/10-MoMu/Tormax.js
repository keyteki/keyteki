const GiganticCard = require('../../GiganticCard.js');

class Tormax extends GiganticCard {
    // (Play only with the other half of Tormax.)
    // Play/After Fight/After Reap: Discard your hand. Purge 2 random cards
    // from your opponent’s hand.
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.play({
            fight: true,
            reap: true,
            effect: 'discard {1}',
            effectArgs: (context) => [context.player.hand],
            gameAction: ability.actions.sequential([
                ability.actions.discardEntireLocation((context) => ({
                    target: context.player,
                    location: 'hand'
                })),
                ability.actions.purgeAtRandom({
                    amount: 2
                })
            ])
        });
    }
}

Tormax.id = 'tormax';

module.exports = Tormax;
