const Card = require('../../Card.js');

class CullTheWeak extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'mostStat',
                cardType: 'creature',
                controller: 'opponent',
                numCards: 1,
                cardStat: (card) => -card.power,
                gameAction: ability.actions.destroy()
            }
        });
    }
}

CullTheWeak.id = 'cull-the-weak';

module.exports = CullTheWeak;
