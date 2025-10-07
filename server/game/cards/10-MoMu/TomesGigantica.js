import Card from '../../Card.js';

class TomesGigantica extends Card {
    // Play: Search your deck and discard pile for two halves of a
    // gigantic creature, reveal them, and put them in your
    // hand. Purge Tomes Gigantica.
    setupCardAbilities(ability) {
        this.play({
            effect: 'search for two parts of a Gigantic creature part and put them in their hand',
            gameAction: ability.actions.search({
                cardCondition: (card) => card.gigantic,
                amount: 2,
                destination: 'hand'
            }),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.purge((context) => ({
                    target: context.source
                })),
                message: '{0} uses {1} to purge {1}'
            }
        });
    }
}

TomesGigantica.id = 'tomes-gigantica';

export default TomesGigantica;
