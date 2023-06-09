const Card = require('../../Card.js');

class WailOfTheDamned extends Card {
    // Enhance PT. (These icons have already been added to cards in your deck.)
    // Play: Destroy a creature with no bonus icons.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'exactly',
                numCards: 1,
                cardType: 'creature',
                cardCondition: (card) => card.bonusIcons.length === 0,
                gameAction: ability.actions.destroy()
            }
        });
    }
}

WailOfTheDamned.id = 'wail-of-the-damned';

module.exports = WailOfTheDamned;
