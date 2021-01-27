const Card = require('../../Card.js');

class CrossPorpoises extends Card {
    //Play: Raise the tide. Enrage 2 enemy creatures.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'exactly',
                cardType: 'creature',
                controller: 'opponent',
                numCards: 2,
                gameAction: ability.actions.enrage()
            },
            gameAction: ability.actions.raiseTide()
        });
    }
}

CrossPorpoises.id = 'cross-porpoises';

module.exports = CrossPorpoises;
