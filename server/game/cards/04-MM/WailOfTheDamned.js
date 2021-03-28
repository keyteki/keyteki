const Card = require('../../Card.js');

class WailOfTheDamned extends Card {
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
