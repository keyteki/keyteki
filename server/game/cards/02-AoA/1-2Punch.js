const Card = require('../../Card.js');

class OneTwoPunch extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: [
                    ability.actions.stun(context => ({
                        target: context.game.creaturesInPlay.filter(card => !card.stunned)
                    })),
                    ability.actions.destroy(context => ({
                        target: context.game.creaturesInPlay.filter(card => card.stunned)
                    }))
                ]
            }
        });
    }
}

OneTwoPunch.id = '1-2-punch'; // This is a guess at what the id might be - please check it!!!

module.exports = OneTwoPunch;
