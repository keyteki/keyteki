const Card = require('../../Card.js');

class TakeABreak extends Card {
    // Play: Exhaust the least powerful enemy creature and each of its neighbors.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'leastStat',
                cardType: 'creature',
                controller: 'opponent',
                numCards: 1,
                cardStat: (card) => card.power
            },
            gameAction: ability.actions.exhaust((context) => ({
                target: context.target
                    ? [].concat(...[].concat(context.target).map((c) => [c, ...c.neighbors]))
                    : []
            }))
        });
    }
}

TakeABreak.id = 'take-a-break';

module.exports = TakeABreak;
