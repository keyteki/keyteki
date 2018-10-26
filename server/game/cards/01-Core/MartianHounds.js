const Card = require('../../Card.js');

class MartianHounds extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.addPowerCounter(context => ({
                    amount: context.game.creaturesInPlay.filter(card => card.hasToken('damage')).length
                }))
            }
        });
    }
}

MartianHounds.id = 'martian-hounds'; // This is a guess at what the id might be - please check it!!!

module.exports = MartianHounds;
