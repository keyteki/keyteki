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
                    gameAction: ability.actions.returnToDeck({shuffle: true })
                }
            },
            effects: 'shuffle {1} into their owner\'s deck',
            effectsArg: context => Object.values(context.targets)
        });
    }
}

LostInTheWoods.id = 'lost-in-the-woods'; // This is a guess at what the id might be - please check it!!!

module.exports = LostInTheWoods;
