const Card = require('../../Card.js');

class HorsemanOfFamine extends Card {
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            target: {
                mode: 'mostStat',
                cardType: 'creature',
                numCards: 1,
                cardStat: card => -card.power,
                gameAction: ability.actions.destroy()
            }
        });
    }
}

HorsemanOfFamine.id = 'horseman-of-famine'; // This is a guess at what the id might be - please check it!!!

module.exports = HorsemanOfFamine;
