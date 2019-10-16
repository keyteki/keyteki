const Card = require('../../Card.js');

class Ragnarok extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.forRemainderOfTurn({
                    effect: ability.effects.cardCannot('reap')
                }),
                ability.actions.forRemainderOfTurn(context => ({
                    when: {
                        onFight: () => true
                    },
                    message: '{0} gains 1 amber due to {1}\'s effect',
                    gameAction: ability.actions.gainAmber({ target: context.player })
                })),
                ability.actions.untilNextTurn({
                    when: {
                        onRoundEnded: () => true
                    },
                    message: '{0} destroys all creatures due to {1}\'s effect',
                    gameAction: ability.actions.destroy(context => ({ target: context.game.creaturesInPlay }))
                })
            ]
        });
    }
}

Ragnarok.id = 'ragnarok';

module.exports = Ragnarok;
