const Card = require('../../Card.js');

class ThreeFates extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'mostStat',
                cardType: 'creature',
                numCards: 3,
                cardStat: (card) => card.power,
                gameAction: ability.actions.destroy()
            }
        });
    }
}

ThreeFates.id = 'three-fates';

module.exports = ThreeFates;
