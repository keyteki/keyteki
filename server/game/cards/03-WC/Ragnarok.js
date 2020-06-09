const Card = require('../../Card.js');

class Ragnarok extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.forRemainderOfTurn({
                    effect: ability.effects.cardCannot('reap')
                }),
                ability.actions.forRemainderOfTurn((context) => ({
                    when: {
                        onFight: () => true
                    },
                    gameAction: ability.actions.gainAmber({ target: context.player })
                })),
                ability.actions.untilNextTurn({
                    when: {
                        onRoundEnded: () => true
                    },
                    gameAction: ability.actions.destroy((context) => ({
                        target: context.game.creaturesInPlay
                    }))
                })
            ]
        });
    }
}

Ragnarok.id = 'ragnarok';

module.exports = Ragnarok;
