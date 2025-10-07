import Card from '../../Card.js';

class FlintsMap extends Card {
    // Omni: Search your deck and discard pile for Flint’s Legend,
    // Flint’s Stash, or Treasure Island, reveal the card and archive
    // it.
    setupCardAbilities(ability) {
        this.omni({
            gameAction: ability.actions.search({
                cardCondition: (card) =>
                    card.name === 'Flint’s Legend' ||
                    card.name === 'Flint’s Stash' ||
                    card.name === 'Treasure Island',
                amount: 1,
                destination: 'archives'
            })
        });
    }
}

FlintsMap.id = 'flint-s-map';

export default FlintsMap;
