const Card = require('../../Card.js');

class BearFlute extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                cardCondtion: card => card.name === 'Ancient Bear',
                gameAction: ability.actions.heal({ fully: true })
            },
            effect: '{1}{0}',
            effectArgs: context => context.target ? 'heal ' : 'search their deck and discard for any Ancient Bears',
            gameAction: ability.actions.search(
                context => !context.game.creaturesInPlay.some(card => card.name === 'Ancient Bear') ? { cardName: 'Ancient Bear' } : {}
            )
        });
    }
}

BearFlute.id = 'bear-flute'; // This is a guess at what the id might be - please check it!!!

module.exports = BearFlute;
