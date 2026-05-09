const GiganticCard = require('../../GiganticCard.js');

class HorizonSaber extends GiganticCard {
    // (Play only with the other half of Horizon Saber.)
    // Play/After Fight/After Reap: Search your deck and discard pile for a card,
    // reveal it, and put it into your archives. Shuffle your discard
    // pile into your deck.
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.play({
            reap: true,
            fight: true,
            gameAction: ability.actions.sequential([
                ability.actions.search({
                    amount: 1,
                    destination: 'archives'
                }),
                ability.actions.returnToDeck((context) => ({
                    shuffle: true,
                    shuffleDiscardIntoDeck: true,
                    target: context.player.discard
                }))
            ]),
            effect: 'search deck and discard for a card, archive it, and shuffle their discard into their deck'
        });
    }
}

HorizonSaber.id = 'horizon-saber';

module.exports = HorizonSaber;
