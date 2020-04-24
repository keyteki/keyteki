const Card = require('../../Card.js');

class FangsOfGizelhart extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                mode: 'mostStat',
                numCards: 1,
                cardStat: card => card.power,
                gameAction: ability.actions.purge()
            }
        });
    }
}

FangsOfGizelhart.id = 'fangs-of-gizelhart';

module.exports = FangsOfGizelhart;
