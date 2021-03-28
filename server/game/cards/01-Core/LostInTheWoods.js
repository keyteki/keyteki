const Card = require('../../Card.js');

class LostInTheWoods extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                friendly: {
                    mode: 'exactly',
                    numCards: 2,
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.returnToDeck({ shuffle: true })
                },
                enemy: {
                    mode: 'exactly',
                    numCards: 2,
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.returnToDeck({ shuffle: true })
                }
            },
            effect: "shuffle {1} into their owner's deck",
            effectArgs: (context) => [Object.values(context.targets)]
        });
    }
}

LostInTheWoods.id = 'lost-in-the-woods';

module.exports = LostInTheWoods;
