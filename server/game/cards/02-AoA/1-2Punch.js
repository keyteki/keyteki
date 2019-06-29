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

OneTwoPunch.id = '1-2-punch';

module.exports = OneTwoPunch;
