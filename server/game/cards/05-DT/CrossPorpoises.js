const Card = require('../../Card.js');

class CrossPorpoises extends Card {
    //Play: Raise the tide. Enrage 2 enemy creatures.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.raiseTide(),
            then: {
                alwaysTriggers: true,
                target: {
                    numCards: '2',
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.enrage()
                }
            }
        });
    }
}

CrossPorpoises.id = 'cross-porpoises';

module.exports = CrossPorpoises;
